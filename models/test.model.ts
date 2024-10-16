import instance from "@/utils/axios.utils"

const test = {
  testRequest: (id: string) => {
    let promise = new Promise((resolve, reject) => {
      let url = "user/public_profile_details"
      let body = {
        id: id
      }
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        if (error.response) {
          reject(error.response.data.message)
        } else {
          reject(error)
        }
      })
    })
    return promise
  }

}

export default test