import { createContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { SocketSoldProduct } from './socket.type'
import { useDispatch } from 'react-redux'
import { onSocketAddNotification } from '../Redux/notification.slice'
const SocketContext = createContext<Socket | null>(null)

export const REACT_BACK_END_URL = process.env.REACT_APP_MODE === 'DEV' ? 'http://localhost:4001' : 'https://api.kurotiki.io.vn'

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
      const [socketInstance, setSocketInstance] = useState<Socket | null>(null)
      const dispatch = useDispatch()
      useEffect(() => {
            if (!socketInstance) {
                  const IO = io(REACT_BACK_END_URL, { withCredentials: true, transports: ['websocket', 'polling', 'flashsocket'] })
                  setSocketInstance(IO)
                  return
            }

            const onConnect = () => {
                  socketInstance.emit('Hello', 'How are you...')
            }

            const onSoldProduct = (socketPayload: SocketSoldProduct) => {
                  console.log({socketPayload})
                  dispatch(onSocketAddNotification({ type: socketPayload.type, data: [socketPayload.info] }))
            }

            const onDisconnect = () => {}
            if (socketInstance) {
                  socketInstance.on('connect', onConnect)
                  socketInstance.on('disconnect', onDisconnect)
                  socketInstance.on('onSoldProduct', onSoldProduct)
            }

            return () => {
                  socketInstance.off('connect', onConnect)
                  socketInstance.off('disconnect', onDisconnect)
                  socketInstance.off('onSoldProduct', onSoldProduct)
            }
      }, [socketInstance])

      return <SocketContext.Provider value={socketInstance}>{children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
