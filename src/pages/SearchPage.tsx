/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Search result page (simple frontend-only matching)
 */
import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

interface SearchItem {
  path: string
  title: string
  keywords: string[]
}

const SEARCH_INDEX: SearchItem[] = [
  {
    path: '/products/ocr',
    title: 'Image OCR & format conversion',
    keywords: ['ocr', 'image', 'image to text', 'scan', 'screenshot']
  },
  {
    path: '/products/binary-extract',
    title: 'Binary file text extraction',
    keywords: ['binary', 'pdf', 'word', 'text extract', 'document']
  },
  {
    path: '/products/text-tools',
    title: 'Online text tools',
    keywords: ['text tools', 'remove line breaks', 'word counter', 'json format']
  },
  {
    path: '/products/edit-text',
    title: 'Online text editor & cleanup',
    keywords: ['text editor', 'edit text', 'clean formatting', 'paragraphs']
  },
  {
    path: '/faq',
    title: 'Frequently asked questions',
    keywords: ['faq', 'questions', 'upload', 'privacy']
  }
]

function useQuery(): URLSearchParams {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export const SearchPage: React.FC = () => {
  const query = useQuery()
  const q = (query.get('q') ?? '').trim().toLowerCase()

  const results = q
    ? SEARCH_INDEX.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.keywords.some(k => k.toLowerCase().includes(q))
        )
      })
    : []

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Search' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Search results</h1>
          <p className="section-description">
            Query:{' '}
            <strong>
              {q || '(nothing entered yet – use the search icon in the header or add ?q=keyword)'}
            </strong>
          </p>
        </div>
        {q && results.length === 0 && (
          <p style={{ fontSize: 14, color: '#4b5563' }}>
            No matching pages were found. Try a more general keyword such as "OCR" or "text".
          </p>
        )}
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          {results.map(item => (
            <li key={item.path}>
              <Link to={item.path}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
