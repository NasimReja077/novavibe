const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="rounded-3xl border border-white/5 bg-[#16161a]/50 p-8 py-16 text-center">
    {Icon && <Icon className="mx-auto mb-3 text-[#94a3b8]" size={36} />}
    <h3 className="text-lg font-bold text-white">{title}</h3>
    {description && <p className="mx-auto mt-1 max-w-sm text-xs text-[#94a3b8]">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
