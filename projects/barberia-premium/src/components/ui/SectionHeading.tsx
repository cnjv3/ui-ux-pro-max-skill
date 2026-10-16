import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  id?: string
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', tone = 'dark', id }: SectionHeadingProps) {
  const center = align === 'center'
  const light = tone === 'light'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl`} data-reveal>
      <p className={`eyebrow ${light ? 'text-bronze' : 'text-gold'} ${center ? 'justify-center' : ''}`}>{eyebrow}</p>
      <h2 id={id} className={`heading mt-5 text-4xl sm:text-5xl lg:text-[3.6rem] ${light ? 'text-ink' : 'text-ivory'}`}>
        {title}
      </h2>
      {intro && <p className={`mt-6 text-[0.95rem] leading-relaxed ${light ? 'text-taupe' : 'text-stone'}`}>{intro}</p>}
    </div>
  )
}
