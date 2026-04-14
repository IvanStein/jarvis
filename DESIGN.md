# Design System Strategy: Kinetic Cyber-Minimalism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Terminal."** We are moving beyond the static "file manager" cliché and toward a high-frequency, precision-engineered environment. This system rejects the "template" look of standard dashboards by embracing **intentional asymmetry** and **tonal depth**. 

We achieve a premium feel by treating the interface like a high-end physical hardware console. Layouts should feel breathable yet dense with information. Instead of a rigid grid, we use overlapping elements—such as a progress bar that slightly breaks the container's padding—to create a sense of motion and technical sophistication.

## 2. Colors: The High-Contrast Pulse
The palette is rooted in a total-darkness philosophy (`background: #0e0e0e`), allowing the vibrant neon green (`primary: #8eff71`) to act as a functional signal rather than just decoration.

*   **The "No-Line" Rule:** Under no circumstances are 1px solid borders to be used for sectioning. Structural separation must be achieved via background shifts. For instance, a file list sitting on a `surface` background should be contained within a `surface-container-low` area. 
*   **Surface Hierarchy & Nesting:** Use the `surface-container` tiers to create "nested" depth.
    *   **Level 0:** `surface` (#0e0e0e) for the global background.
    *   **Level 1:** `surface-container-low` (#131313) for large sidebar or navigation areas.
    *   **Level 2:** `surface-container` (#1a1a1a) for the primary content cards.
    *   **Level 3:** `surface-container-highest` (#262626) for active or hovered states.
*   **The "Glass & Gradient" Rule:** To provide "soul" to the UI, floating overlays (like file-action menus) must use `surface-bright` (#2c2c2c) at 60% opacity with a `20px` backdrop blur. 
*   **Signature Textures:** For primary CTAs and active progress bars, do not use a flat fill. Use a linear gradient transitioning from `primary` (#8eff71) to `primary-container` (#2ff801) at a 135-degree angle to create a "liquid light" effect.

## 3. Typography: Editorial Precision
The typography system balances the technical grit of **Space Grotesk** for high-impact data points with the clinical readability of **Inter** for functional UI.

*   **Display & Headlines (Space Grotesk):** Use `display-md` (2.75rem) for main dashboard headings. The exaggerated kerning and geometric shapes of Space Grotesk convey a "terminal" aesthetic that feels custom.
*   **Functional UI (Inter):** All file names, sizes, and metadata use `body-md` or `label-md`. Inter’s tall x-height ensures legibility against high-contrast neon backgrounds even at small scales.
*   **The Power of Scale:** Use high contrast in size—pair a `headline-lg` title with a `label-sm` metadata tag to create an editorial, high-end feel rather than a uniform "standard" list.

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to represent "height"; we use light. 

*   **The Layering Principle:** Stacking is the primary tool for hierarchy. A "Transferring" file card should be `surface-container-highest`, sitting on a main panel of `surface-container-low`. The 13% lightness difference is the only divider needed.
*   **Ambient Shadows:** If an element must float (e.g., a "New Download" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6)`. Add a subtle glow using `primary` at 4% opacity to simulate the neon light reflecting off the "hardware" surface.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use a "Ghost Border": `outline-variant` (#484847) at 15% opacity. Never use 100% opaque lines.
*   **Kinetic Progress:** Progress bars should not just be green lines. Use a `0.5rem` height with a subtle `primary-dim` outer glow to make the progress feel "energized."

## 5. Components: Engineered for Performance

### Buttons
*   **Primary:** Fill with `primary` to `primary-container` gradient. Text in `on-primary` (#0d6100). Radius: `md` (0.375rem).
*   **Secondary/Ghost:** No fill. `Ghost Border` (15% opacity) with text in `primary`. On hover, shift background to `primary` at 8% opacity.

### Progress Indicators (The Signature Component)
*   **The Track:** `surface-container-highest`.
*   **The Fill:** `primary` neon. For active downloads, add a "shimmer" effect—a white highlight at 20% opacity moving across the bar every 2 seconds.
*   **The Label:** Place the percentage (`label-md`) above the bar, right-aligned, using `primary` color to ensure it is the first thing the eye tracks.

### File Cards
*   **Structure:** No dividers. Use `1.5` (0.375rem) vertical spacing between list items.
*   **State:** On hover, transition the background to `surface-bright`.
*   **Asymmetry:** Place the file extension (e.g., .ZIP, .MOV) in a `label-sm` badge with a `secondary-container` background. Position it slightly offset from the main file name to break the vertical line of the text.

### Input Fields
*   **Style:** `surface-container-lowest` fill. No bottom border. Focus state is indicated by a `primary` "Ghost Border" at 40% opacity and a slight increase in the `backdrop-blur`.

### Action Chips
*   **Filter Chips:** `surface-container-high` background. When selected, use `primary` text and a `primary` 2px dot to the left of the label, rather than filling the whole chip.

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** Use `12` (3rem) and `16` (4rem) spacing tokens between major functional blocks to let the neon accents "breathe."
*   **Use Micro-Interactions:** When a download completes, the progress bar should "flash" to `secondary` (#90f9a3) before settling into its final state.
*   **Layer Surfaces:** Use `surface-container-low` for global areas and `surface-container-highest` for interactive components.

### Don't:
*   **No Dividers:** Never use a horizontal rule `<hr>` or `border-bottom` to separate files in a list. Use vertical white space (`1.5` to `2` scale).
*   **No Grey Text on Black:** Avoid low-contrast grey for secondary text. Use `on-surface-variant` (#adaaaa) to ensure accessibility (WCAG AA).
*   **No Full Rounding:** Avoid `full` (9999px) pills for main cards; stick to `lg` (0.5rem) or `xl` (0.75rem) for a more architectural, modern look. Reserve `full` only for small status chips.