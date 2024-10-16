import instance from "@/utils/axios.utils"

const user = {
  userList: (data: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = "user/user_list"
      instance().post(url, data).then(res => {
        resolve(res.data)
      }).catch(error => {
        if (error.response) {
          reject(error.response.message)
        } else {
          reject(error)
        }
      })
    })
    return promise
  },


  updateUser: (data: any, id: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `auth/edit_user/${id}`
      instance().post(url, data).then(res => {
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
  },


  addUser: (data: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = "user/add_user"
      instance().post(url, data).then(res => {
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
  },

  getUserId: (id: any) => {
    let promise = new Promise((resolve, reject) => {
      let url = `auth/view_user/${id}`
      instance().post(url).then(res => {
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
  },

  uploadFile: (file: any) => {
    let promise = new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      let url = '/hdd/upload_file';
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8;',
        },
      };
      instance()
        .post(url, formData, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
    return promise;
  },

}



export default user