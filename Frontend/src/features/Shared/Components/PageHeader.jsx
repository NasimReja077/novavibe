const PageHeader = ({ icon: Icon, title, description, action, accent = "#d62b70" }) => (
  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <div className="mb-1 flex items-center gap-2">
        {Icon && <Icon className="shrink-0" style={{ color: accent }} size={22} />}
        <h1 className="font-['Montserrat'] text-2xl font-black tracking-tight text-white md:text-3xl">
          {title}
        </h1>
      </div>
      {description && <p className="text-xs text-[#94a3b8] md:text-sm">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
