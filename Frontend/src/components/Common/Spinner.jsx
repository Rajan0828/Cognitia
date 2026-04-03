const Spinner = () => {
  return (
    <div className='flex min-h-[40vh] items-center justify-center p-8'>
      <div className='relative flex flex-col items-center gap-4'>
        <div className='absolute h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl' />
        <div className='relative flex h-18 w-18 items-center justify-center rounded-[1.75rem] border border-emerald-100 bg-white/80 shadow-lg shadow-emerald-500/10 backdrop-blur-xl'>
          <div className='absolute inset-0 rounded-[1.75rem] bg-linear-to-br from-emerald-50 via-white to-teal-50' />
          <div className='relative h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-100 border-t-emerald-500 border-r-teal-400' />
          <div className='absolute h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.45)]' />
        </div>
        <p className='text-sm font-medium tracking-tight text-slate-500'>Loading your workspace...</p>
      </div>
    </div>
  );
};

export default Spinner;
