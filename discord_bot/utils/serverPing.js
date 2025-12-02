const dgram = require('dgram');
const mcpePing = require('mcpe-ping');

// 未処理のエラーをキャッチしてプロセスが落ちるのを防ぐ
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception in serverPing:', error);
	// プロセスを落とさずにエラーをログに記録
});

process.on('unhandledRejection', (reason, promise) => {
	console.error(
		'Unhandled Rejection in serverPing at:',
		promise,
		'reason:',
		reason
	);
	// プロセスを落とさずにエラーをログに記録
});

/**
 * 基本的なUDPソケットを使用したMinecraftサーバーのping
 */
function basicUDPPing(host, port, timeout = 5000) {
	return new Promise((resolve, reject) => {
		let isResolved = false;
		const client = dgram.createSocket('udp4');
		const startTime = Date.now();

		// タイムアウト設定
		const timeoutId = setTimeout(() => {
			if (!isResolved) {
				isResolved = true;
				try {
					client.close();
				} catch (e) {
					// ソケットが既に閉じられている場合のエラーを無視
				}
				reject(new Error('Connection timeout'));
			}
		}, timeout);

		client.on('message', (msg, rinfo) => {
			if (isResolved) return;

			clearTimeout(timeoutId);
			isResolved = true;
			const responseTime = Date.now() - startTime;

			// 基本的な応答があれば成功とみなす
			resolve({
				online: true,
				responseTime,
				host: rinfo.address,
				port: rinfo.port,
				message: 'Server is responding',
				dataLength: msg.length,
			});

			try {
				client.close();
			} catch (e) {
				// ソケットが既に閉じられている場合のエラーを無視
			}
		});

		client.on('error', (err) => {
			if (!isResolved) {
				clearTimeout(timeoutId);
				isResolved = true;
				try {
					client.close();
				} catch (e) {
					// ソケットが既に閉じられている場合のエラーを無視
				}
				reject(new Error(`UDP socket error: ${err.message}`));
			}
		});

		try {
			// 簡単なping パケットを送信
			const pingPacket = Buffer.alloc(1);
			pingPacket[0] = 0x01; // Unconnected ping packet

			client.send(pingPacket, 0, pingPacket.length, port, host, (err) => {
				if (err && !isResolved) {
					clearTimeout(timeoutId);
					isResolved = true;
					try {
						client.close();
					} catch (e) {
						// ソケットが既に閉じられている場合のエラーを無視
					}
					reject(new Error(`Failed to send UDP packet: ${err.message}`));
				}
			});
		} catch (error) {
			if (!isResolved) {
				clearTimeout(timeoutId);
				isResolved = true;
				try {
					client.close();
				} catch (e) {
					// ソケットが既に閉じられている場合のエラーを無視
				}
				reject(new Error(`UDP ping setup error: ${error.message}`));
			}
		}
	});
}

/**
 * mcpe-pingライブラリを安全に使用するラッパー関数
 */
function safeMcpePing(host, port, timeout = 10000) {
	return new Promise((resolve, reject) => {
		let isResolved = false;

		const timeoutId = setTimeout(() => {
			if (!isResolved) {
				isResolved = true;
				reject(new Error('mcpe-ping timeout'));
			}
		}, timeout);

		try {
			mcpePing(host, port, (err, res) => {
				if (isResolved) return;

				clearTimeout(timeoutId);
				isResolved = true;

				if (err) {
					// ByteBufferエラーなどの特定のエラーをキャッチして安全に処理
					if (err.message && err.message.includes('Illegal offset')) {
						reject(new Error('Server response format error (ByteBuffer)'));
					} else if (err.message && err.message.includes('RangeError')) {
						reject(new Error('Server response parsing error'));
					} else {
						reject(new Error(`mcpe-ping error: ${err.message}`));
					}
					return;
				}

				// レスポンスの妥当性をチェック
				if (!res) {
					reject(new Error('Empty response from server'));
					return;
				}

				resolve(res);
			});
		} catch (error) {
			if (!isResolved) {
				clearTimeout(timeoutId);
				isResolved = true;
				// 予期しないエラーをキャッチ
				if (
					error.name === 'RangeError' ||
					error.message.includes('Illegal offset')
				) {
					reject(new Error('Server response format error'));
				} else {
					reject(new Error(`mcpe-ping unexpected error: ${error.message}`));
				}
			}
		}
	});
}

/**
 * 複数の方法でサーバーをpingし、最初に成功した結果を返す
 */
async function pingMinecraftServer(host, port = 19132) {
	const methods = [
		{
			name: 'mcpe-ping',
			func: () => safeMcpePing(host, port),
		},
		{
			name: 'basic-udp',
			func: () => basicUDPPing(host, port),
		},
	];

	const errors = [];
	let lastError = null;

	for (const method of methods) {
		try {
			const result = await method.func();
			return {
				success: true,
				method: method.name,
				data: result,
				errors: errors, // デバッグ用に他の方法のエラーも記録
			};
		} catch (error) {
			const errorInfo = {
				method: method.name,
				error: error.message,
				timestamp: new Date().toISOString(),
			};
			errors.push(errorInfo);

			lastError = error;

			// クリティカルエラーの場合はログに記録
			if (
				error.message.includes('RangeError') ||
				error.message.includes('ByteBuffer')
			) {
				console.warn(
					`Critical parsing error in ${method.name}:`,
					error.message
				);
			}
		}
	}

	// すべての方法が失敗した場合でも、構造化されたエラー情報を返す
	return {
		success: false,
		error: lastError,
		message: `All ping methods failed: ${lastError?.message}`,
		errors: errors,
		host,
		port,
	};
}

/**
 * 安全なpingラッパー関数 - 絶対にプロセスを落とさない
 */
async function safePingMinecraftServer(host, port = 19132) {
	try {
		const result = await pingMinecraftServer(host, port);
		return result;
	} catch (error) {
		console.error('Critical error in safePingMinecraftServer:', error);

		// どんなエラーが発生してもプロセスを落とさない
		return {
			success: false,
			error: error,
			message: `Critical ping error: ${error.message}`,
			host,
			port,
			timestamp: new Date().toISOString(),
		};
	}
}

module.exports = {
	safePingMinecraftServer, // 新しい安全な関数をエクスポート
};
