"use client"; 


export default function AuthLayout({ children }) {

  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}