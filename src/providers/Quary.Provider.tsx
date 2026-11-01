
import { QueryClient } from '@tanstack/react-query'

function MakeQuaryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 , 
        }
      }
    })
         
}



export default function QuaryProvider() {
  return (
    <div>Quary.Provider</div>
  )
}
