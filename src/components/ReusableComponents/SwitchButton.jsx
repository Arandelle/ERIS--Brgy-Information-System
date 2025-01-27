const SwitchButton = ({onChange, isOtpEnabled}) => {

  return (
    <label class="relative inline-block text-[17px] w-[3em] h-[1.5em]">
      <input type="checkbox" class="opacity-0 w-0 h-0 peer" checked={isOtpEnabled} onChange={onChange}/>
      <span class="absolute inset-0 cursor-pointer bg-[#9fccfa] rounded-full transition-all duration-[0.4s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:bg-blue-800"></span>
      <span class="absolute cursor-pointer content-[''] flex items-center justify-center h-[1.5em] w-[1.5em] inset-0 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-[0.4s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]  peer-checked:translate-x-6"></span>
    </label>
  );
};

export default SwitchButton;
