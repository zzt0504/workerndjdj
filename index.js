// 定义目标服务器地址和端口
const TARGET_IP = "199.245.100.23";
const TARGET_PORT = "54666";

export default {
  async fetch(request) {
    try {
      // --------------- 1. 处理 OPTIONS 预检请求 ---------------
      if (request.method === "OPTIONS") {
        // 返回预检响应（直接处理，无需转发到目标服务器）
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }

      // --------------- 2. 修改请求目标地址 ---------------
      const url = new URL(request.url);
      url.hostname = TARGET_IP;
      url.port = TARGET_PORT;
      url.protocol = "http:"; // 强制使用 HTTP（若目标服务器不支持 HTTPS）

      // --------------- 3. 转发请求到目标服务器 ---------------
      const response = await fetch(url.toString(), request);

      // --------------- 4. 克隆并修改响应头（添加 CORS）---------------
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      newHeaders.set("Access-Control-Allow-Headers", "Content-Type");

      // --------------- 5. 返回修改后的响应 ---------------
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    } catch (error) {
      // --------------- 6. 错误处理 ---------------
      return new Response("Proxy Error: " + error.message, { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*" // 错误时也允许跨域
        }
      });
    }
  }
};
