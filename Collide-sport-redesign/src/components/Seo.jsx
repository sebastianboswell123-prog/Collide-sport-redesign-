import { useEffect } from 'react'

/**
 * Per-page <head> management — title, meta description, canonical, and
 * Open Graph / Twitter tags. Dependency-free (no react-helmet): upserts the
 * relevant tags imperatively on mount / prop change. Safe for this SPA.
 *
 * Props
 *   title       page <title> (a site suffix is appended)
 *   description meta description + og/twitter description
 *   image       absolute OG image URL (defaults to brand image)
 *   type        og:type ('website' | 'product' | 'article')
 */

const SITE_NAME = 'Collide Sport'
const SITE_URL  = 'https://www.collidesport.co.za'
const DEFAULT_IMAGE = 'https://collidesport.co.za/cdn/shop/files/COLLIDE_TM_SPORT.png?v=1696518150&width=1200'

function upsertMeta(selectorAttr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${selectorAttr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(selectorAttr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ title, description, image = DEFAULT_IMAGE, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Rugby Scrum Caps & Activewear`
    const url = typeof window !== 'undefined' ? window.location.href : SITE_URL

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertLink('canonical', url)

    // Open Graph
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)
  }, [title, description, image, type])

  return null
}
