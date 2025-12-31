import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-24 bg-[#F3F5F4]">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative text-center flex flex-col items-center"> 
      
      <Quote className="w-12 h-12 text-[#F4C168] mb-6 mx-auto" />

      {/* 1. Changed to text-3xl for mobile and text-4xl for larger screens
          2. Added ! to ensure it overrides any global blockquote styles 
      */}
      <blockquote className="!text-2xl sm:!text-4xl leading-none mb-8 font-serif text-foreground space-y-1">
        "My landlord threatened to take me to small claims court for breaking my lease. Turns out, they were the ones trying to exploit me — and they actually owed me money. They're now dropping everything."
      </blockquote>

      <div className="flex items-center justify-center gap-4 text-left">
        <div className="w-12 h-12 rounded-full bg-[#DDE0E1] flex items-center justify-center text-primary-foreground text-lg shrink-0 font-serif">
          A
        </div>
        <div>
          <div className="text-md font-bold text-[15px] text-slate-700">Anonymous User</div>
          <div className="text-[14px] text-[#626D84]">Landlord/Tenant Dispute</div>
        </div>
      </div>

    </div>
  </div>
</section>
  );
};

export default Testimonial;
