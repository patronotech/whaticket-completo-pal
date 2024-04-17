import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';
const {
  formField: {
    firstName,
    address1,
    city,
    zipcode,
    country,
  }
} = checkoutFormModel;


export default [
  Yup.object().shape({
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),

    [zipcode.name]: Yup.string()
      .required(`${zipcode.requiredErrorMsg}`),
  }),

];
