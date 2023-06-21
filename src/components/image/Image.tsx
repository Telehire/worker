import { useState } from 'react'

// @ts-ignore
const Image = ({ src, alt, fallback }) => {
  const [error, setError] = useState(false)

  const onError = () => {
    setError(true)
  }

  return error ? fallback : <img src={src} alt={alt} onError={onError} />
}

export default Image
