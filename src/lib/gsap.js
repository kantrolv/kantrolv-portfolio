import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// House easing — everything expensive-feeling routes through these two.
CustomEase.create('regal', 'M0,0 C0.16,1 0.3,1 1,1') // ≈ cubic-bezier(.16,1,.3,1) — long, settling out
CustomEase.create('silk', 'M0,0 C0.65,0 0.15,1 1,1') // ≈ cubic-bezier(.65,0,.15,1) — stately in-out

gsap.defaults({ ease: 'regal', duration: 1 })

export { gsap, ScrollTrigger, SplitText }
