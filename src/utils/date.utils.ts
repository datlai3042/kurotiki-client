export const convertDateToString = (date: Date) => {
    console.log({ date })
    date = new Date(date)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
