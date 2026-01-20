/**
 * Reusable button style classes
 * Matches the neumorphic style used in the website navbar
 */

/**
 * Primary neumorphic button style (used for admin buttons)
 * Uses the primary color (#424C61 - dark blue)
 */
export const neumorphicButtonPrimary = `
  bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
  transition-all duration-200 ease-in-out border-2 border-primary/80
  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
  focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
`.trim().replace(/\s+/g, ' ');

/**
 * Secondary neumorphic button style (used for other buttons)
 * Uses the secondary-dark color (#7A3828 - brown)
 */
export const neumorphicButtonSecondary = `
  bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
  transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
  focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
`.trim().replace(/\s+/g, ' ');

/**
 * Small neumorphic button style (for icon buttons and smaller actions)
 */
export const neumorphicButtonSmall = `
  bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
  transition-all duration-200 ease-in-out border-2 border-primary/80
  shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
  hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
  focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
`.trim().replace(/\s+/g, ' ');

