const TARGET_IP = "199.245.100.23";
const TARGET_PORT = "54666";

export default {
  async fetch(request) {
    try {
      // --------------- 1. 处理 OPTIONS 预检请求 ---------------
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }

      // --------------- 2. 修改请求目标并设置 Host 头 ---------------
      const url = new URL(request.url);
      url.hostname = TARGET_IP;
      url.port = TARGET_PORT;
      url.protocol = "http:"; // 强制 HTTP

      // 克隆请求并设置 Host 头
      const newRequest = new Request(url.toString(), {
        ...request,
        headers: {
          ...Object.fromEntries(request.headers),
          "Host": TARGET_IP // 关键：设置 Host 头为目标 IP 或域名
        }
      });

      // --------------- 3. 转发请求到目标服务器 ---------------
      const response = await fetch(newRequest);

      // --------------- 4. 添加 CORS 头并返回响应 ---------------
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });

    } catch (error) {
      return new Response("Proxy Error: " + error.message, { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
