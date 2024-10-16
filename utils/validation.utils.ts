import * as Yup from 'yup';
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const Mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

export const loginSchema = Yup.object().shape({
  password: Yup.string().required(' Please enter password'),
  email: Yup.string().required(' Please enter email').email('Must be a valid email'),
});

export const changePassword = Yup.object().shape({
  password: Yup.string().required('Please enter new password'),
  // .matches(
  //   regexPassword,
  //   ' Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character',
  // ),
});

export const forgetPassword = Yup.object().shape({
  email: Yup.string().required(' Please enter email').email('Must be a valid email'),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('otp is required')
    .min(6, 'OTP must be exactly 6 digits')
    .max(6, 'OTP must be exactly 6 digits'),
});

export const forgetPassSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').matches(Mail, 'Enter valid email'),
});
export const profile = Yup.object().shape({
  id_image: Yup.string().required('Please choose your ID-image'),
  address: Yup.string().required('Please enter your address'),
  mobile: Yup.string()
    .required('Please enter your mobile number')
    .min(10, 'Mobile number must be at least 10 degits'),
  id_number: Yup.string().required('Please enter your ID-number'),
  designation: Yup.string().required('Please enter your designation'),
  name: Yup.string().required('Please enter your name'),
  profile_picture: Yup.string().required('Please choose your profile picture'),
});

export const addClient = Yup.object().shape({
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        mobile: Yup.string()
          .max(255)
          .required('please enter contact mobile')
          .label('mobile')
          .min(10, 'mobile number at least 10 degits '),
        email: Yup.string()
          .max(255)
          .required('please enter contact email')
          .label('email')
          .email('Must be a valid email'),
        name: Yup.string().max(255).required('please enter contact name').label('name'),
      }),
    )
    .min(1, 'Please enter at least one contact'),

  address: Yup.string().required('please enter address'),
  client_org: Yup.string().required('please enter organization'),
  mobile: Yup.string()
    .required('please enter mobile number')
    .matches(phoneRegExp, ' Mobile number is not valid')
    .min(10, 'Mobile must be at least 10 degits'),
  email: Yup.string().required(' Please enter email').email('Must be a valid email'),
  name: Yup.string().required('please enter client name'),
});

export const clientDetails = Yup.object().shape({
  email: Yup.string().required(' Please enter Email').email('Must be a valid email'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
});

export const EmpDetail = Yup.object().shape({
  id_image: Yup.string().required('Please choose ID image'),
  address: Yup.string().required('Please enter address'),
  mobile: Yup.string()
    .required('Please enter mobile number')
    .min(10, 'Mobile number must be at least 10 degits'),
  email: Yup.string().required(' Please enter email').email('Must be a valid email'),
  employee_id: Yup.string().required(' Please enter ID number'),
  designation: Yup.string().required('Please enter designation'),
  name: Yup.string().required('Please enter name'),
  profile_picture: Yup.string().required('Please choose image'),
});

export const hddDetail = Yup.object().shape({
  content: Yup.string().required('Please enter content'),
  hdd_size: Yup.string().required('Please enter hdd size'),
  barcode: Yup.string().required('Please enter hdd serial number'),
  hdd_id: Yup.string().required('Please enter hdd number'),
  hdd_name: Yup.string().required('Please enter hdd name'),
  hdd_image: Yup.string().required('Please choose image'),
});

export const updateDetail = Yup.object().shape({
  content: Yup.string().required('Please enter content'),
  hdd_size: Yup.string().required('Please enter hdd size'),
  barcode: Yup.string().required('Please enter hdd serial number'),
  hdd_id: Yup.string().required('Please enter hdd number'),
  hdd_name: Yup.string().required('Please enter hdd name'),
});

export const addProjectVal = Yup.object().shape({
  project_status: Yup.string().required('Please select project status'),
  total_budget: Yup.string().required('Please enter Total Budget'),
  deadline: Yup.string().required('please select project deadline date'),
  start_date: Yup.string().required('please select project take over date'),
  project_type: Yup.array().min(1).required('at least one item needs to be here'),
  name: Yup.string().required('Please enter project name'),
});

export const editProject = Yup.object().shape({
  project_status: Yup.string().required('Please select project status'),
  total_budget: Yup.string().required('Please enter Total Budget'),
  deadline: Yup.string().required('please select project deadline date'),
  start_date: Yup.string().required('please select project take over date'),
  name: Yup.string().required('Please enter project name'),
});

export const editDelivery = Yup.object().shape({
  content: Yup.string().required('Please enter content'),
  hdd_size: Yup.string().required('Please enter hdd size'),
  barcode: Yup.string().required('Please enter hdd serial number'),
  hdd_id: Yup.string().required('Please enter hdd number'),
  hdd_name: Yup.string().required('Please enter hdd name'),
  hdd_image: Yup.string().required('Please choose image'),
});
