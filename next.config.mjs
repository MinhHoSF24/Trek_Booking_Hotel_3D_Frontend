// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/trekbooking',
          permanent: true, // hoặc false nếu bạn không muốn redirect vĩnh viễn
        },
      ];
    },
  };
  
  export default nextConfig;
  