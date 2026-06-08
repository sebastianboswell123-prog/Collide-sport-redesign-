import { useParams } from 'react-router-dom'

export default function Profile() {
  const { id } = useParams()
  return (
    <div className="pt-14 min-h-screen bg-lavender">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-24">
        <p className="text-xs font-mono tracking-widest text-blue uppercase mb-3">Player #{id}</p>
        <h1 className="font-display font-extrabold text-4xl text-navy">Player Profile</h1>
        <p className="text-navy/50 mt-4">Profile details coming soon.</p>
      </div>
    </div>
  )
}
