import React from 'react'

export default function TitleSubtitle({ title, subtitle }) {
  return (
    <div className='w-full mt-12'>
        <div className='flex justify-start w-full'>
            <h1 className='text-[#322153] font-bold text-xl'>
            {title}
            </h1>
        </div>
        <h1 className='text-[#6C6C80]'>
            {subtitle}
        </h1>
    </div>
  )
}
