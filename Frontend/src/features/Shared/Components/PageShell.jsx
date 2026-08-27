const PageShell = ({ children, maxWidth = "max-w-7xl", className = "" }) => (
  <div className={`min-h-screen bg-[#0f0f12] text-[#e4e1e6] pb-36 ${className}`}>
    <div className={`mx-auto w-full ${maxWidth} px-4 py-8 md:px-6 lg:px-8`}>
      {children}
    </div>
  </div>
);

export default PageShell;
