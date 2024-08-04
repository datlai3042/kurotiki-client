import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import AccountService from "../../apis/account.service"
import { fetchUser, onLoading } from "../../Redux/authenticationSlice"

const useGetMe = () => {


      const dispatch = useDispatch()

      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
      })

      useEffect(() => {
            if (getMe.isSuccess) {
                  const { user } = getMe.data.data.metadata
                  dispatch(fetchUser({ user }))
            }
            if(getMe.isPending) {

                  dispatch(onLoading())
            }

            if (getMe.isError) {
                  console.log({ user: getMe.data?.data.metadata })

                  dispatch(fetchUser({ user: undefined }))
            }
      }, [getMe.isSuccess, getMe.isError, dispatch, getMe.data, getMe.isPending])


            return getMe
}

export default useGetMe