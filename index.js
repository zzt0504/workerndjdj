// 目标服务器地址和端口
   const TARGET_IP = "199.245.100.23";
   const TARGET_PORT = "54666";

   export default {
     async fetch(request) {
       try {
         const url = new URL(request.url);
         // 修改请求目标为实际服务器
         url.hostname = TARGET_IP;
         url.port = TARGET_PORT;

         url.protocol = "http:"; // 强制 HTTP
         // 转发请求并返回响应
         const response = await fetch(url.toString(), request);
         return response;
       } catch (error) {
         return new Response("Proxy Error: " + error.message, { status: 500 });
       }
     }
   };
