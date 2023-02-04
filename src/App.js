import React, { useState } from 'react'
import shortid from 'shortid'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './App.css';

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  // const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      // encode the full link into a shorter form using shortid
      const id = shortid.generate()
      setShortUrl(`http://localhost:3000/${id}`)

      // store the full link and its corresponding short link in the database
      const response = await fetch('http://localhost:3000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, url })
      })

      // check for success
      if (response.status !== 200) {
        throw new Error('Failed to create short link')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRedirect = async shortLinkId => {
    try {
      // look up the full link using the short link id
      const response = await fetch(`http://localhost:3000/api/links/${shortLinkId}`)

      // check for success
      if (response.status !== 200) {
        throw new Error('Failed to retrieve full link')
      }

      const { url } = await response.json()
      console.log(url);
      // // redirect the user to the correct page or mobile app
      // router.push(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
        <button type="submit">Convert to short link</button>
      </form>
      <CopyToClipboard
        text={shortUrl}
        onCopy={() => setCopied(true)}
      >
        <button className={copied ? 'copied' : ''}>Скопировать ссылку</button>
      </CopyToClipboard>
      {shortUrl && (
        <a href={url} onClick={() => handleRedirect(shortUrl.split('/').pop())}>
          {shortUrl}
        </a>
      )}
    </div>
  )
}

export default App;