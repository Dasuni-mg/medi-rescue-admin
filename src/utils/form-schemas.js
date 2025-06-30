/**
 * Import required validation functions from Yup library.
 */
import * as yup from 'yup';
import { array, number, object, string } from 'yup';

/**
 * Regular expression patterns for validation.
 */
const nameFieldRegExpretion = /^[A-Za-z0-9_'.-]+(?:\s+[A-Za-z0-9_'.-]+)*$/; // Alphanumeric, special characters (_.'-) and space allowed in between words
const addressFieldRegExpretion = /^[A-Za-z0-9\-\/\.,_']+(?:\s+[A-Za-z0-9\-\/\.,_']+)*$/; // Alphanumeric, special characters (/,.'-_) and space allowed in between words
const contactNumberFieldRegExpretion = /^\+?\d+$/; // Alphanumeric, special characters (/,.'-) and space allowed
const emailRegExpretion = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Alphanumeric and special characters (._%+-)
const vehicleNumberRegExpretion = /^[a-zA-Z0-9._-]*$/; // Alphanumeric and special characters (._-)
const deviceSerialNumberRegExpression = /^[a-zA-Z0-9./-]*$/; // Alphanumeric and special characters (./-)
const numberRegExpretion = /^\d+$/;
const passwordFieldRegExpretion = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]+$/; // Alphanumeric and special characters (!@#$%)

/**
 * Validation schema for role creation.
 */
const roleCreateSchema = object().shape({
  roleName: string().required('Role name is required'),
  description: string().max(200, 'Description cannot be more than 200 characters'),
  roleType: string().required('Role type is required')
});

/**
 * Validation schema for unlocking user.
 */
const unlockUserSchema = object().shape({
  userId: number().required('This field is required'),
  reason: string().max(100, 'This field is required')
});

/**
 * Validation schema for reactivating user.
 */
const reactivateUserSchema = object().shape({
  userId: number().required('This field is required'),
  reason: string().max(100, 'This field is required')
});

/**
 * Validation schema for user creation.
 */
const userCreateSchema = object().shape({
  userName: string().required('This field is required'),
  displayName: string().required('This field is required'),
  password: string()
    .required('This field is required')
    .matches(/^[A-Z](?=.*[a-zA-Z0-9])(?=.*[@#$%^&+=]).*$/, 'First letter should be capital, password must contain a special character')
    .max(100, 'Password cannot exceed 100 characters'),
  email: string().email().required('This field is required'),
  userType: number().required('This field is required'),
  clinics: array()
    .min(1, 'Atleast one clinic should be selected')
    .of(string().required('This field is requireds'))
    .required('This field is requireds'),
  roles: array()
    .min(1, 'Atleast one role should be selected')
    .of(string().required('This field is requireds'))
    .required('This field is requireds')
});

/**
 * Validation schema for signin.
 */
const signinSchema = object().shape({
  userName: string().required('This field is required'),
  password: string().required('This field is required')
});

/**
 * Forgot Password OTP validation
 */
const OTPvalidate = object().shape({
  otpCode: number()
    .required('otp.field.otp.validation.required')
    .min(6, 'otp.field.otp.validation.minLength')
    .max(6, 'otp.field.otp.validation.maxLength'),
  email: string().required('otp.field.otp.validation.required')
});

/**
 * Validation schema for confirm password.
 */
const confirmPasswordSchema = object().shape({
  newPassword: string()
    .required('confirmPassword.field.newPassword.validation.required')
    .matches(passwordFieldRegExpretion, 'confirmPassword.field.newPassword.validation.invalid')
    .min(8, 'confirmPassword.field.newPassword.validation.minLength')
    .max(32, 'confirmPassword.field.newPassword.validation.maxLength'),
  confirmNewPassword: string()
    .oneOf([yup.ref('newPassword')], 'confirmPassword.field.confirmNewPassword.validation.pwdMismatch')
    .required('confirmPassword.field.newPassword.validation.required')
});

/**
 * Validation schema for forgot password.
 */
const forgotpwd = object().shape({
  userName: string().required('forgotPassword.field.userName.validation.required')
});

/**
 * Validation schema for change password.
 */
const changePasswordSchema = object().shape({
  currentPassword: string().required('changePassword.drawer.field.currentPassword.validation.required'),
  newPassword: string()
    .required('changePassword.drawer.field.newPassword.validation.required')
    .matches(passwordFieldRegExpretion, 'changePassword.drawer.field.newPassword.validation.invalid')
    .min(8, 'changePassword.drawer.field.newPassword.validation.minLength')
    .max(32, 'changePassword.drawer.field.newPassword.validation.maxLength'),
  confirmNewPassword: string()
    .oneOf([yup.ref('newPassword')], 'changePassword.drawer.field.confirmNewPassword.validation.pwdMissMatch')
    .required('changePassword.drawer.field.confirmNewPassword.validation.required')
});

/**
 * Validation schema for Tenant creation.
 */
const tenantCreateSchema = object().shape({
  name: string()
    .required('group.drawer.field.name.validation.required')
    .matches(nameFieldRegExpretion, 'group.drawer.field.name.validation.invalid')
    .max(50, 'group.drawer.field.name.validation.maxLength'),
  emailAddress: string()
    .required('group.drawer.field.emailAddress.validation.required')
    .matches(emailRegExpretion, 'group.drawer.field.emailAddress.validation.invalid')
    .max(50, 'group.drawer.field.emailAddress.validation.maxLength'),
  country: string().required('group.drawer.field.country.validation.required').max(100, 'group.drawer.field.country.validation.maxLength'),
  address: string()
    .matches(addressFieldRegExpretion, 'group.drawer.field.address.validation.invalid')
    .max(100, 'group.drawer.field.address.validation.maxLength'),
  contactNumber: string()
    .matches(contactNumberFieldRegExpretion, 'group.drawer.field.contactNumber.validation.invalid')
    .min(10, 'group.drawer.field.contactNumber.validation.minLength')
    .max(15, 'group.drawer.field.contactNumber.validation.maxLength')
});

/**
 * Validation schema for organization creation.
 */
const organizationCreateViewUpdateSchema = object().shape({
  group: string().required('organization.drawer.field.group.validation.required'),
  name: string()
    .required('organization.drawer.field.name.validation.required')
    .matches(nameFieldRegExpretion, 'organization.drawer.field.name.validation.invalid')
    .max(50, 'organization.drawer.field.name.validation.maxLength'),
  organizationType: string().required('organization.drawer.field.organizationType.validation.required'),
  emailAddress: string()
    .required('organization.drawer.field.emailAddress.validation.required')
    .matches(emailRegExpretion, 'organization.drawer.field.emailAddress.validation.invalid')
    .max(50, 'organization.drawer.field.emailAddress.validation.maxLength'),
  country: string().required('organization.drawer.field.country.validation.required'),
  address: string()
    .matches(addressFieldRegExpretion, 'organization.drawer.field.address.validation.invalid')
    .max(100, 'organization.drawer.field.address.validation.maxLength'),
  contactNumber: string()
    .matches(contactNumberFieldRegExpretion, 'organization.drawer.field.contactNumber.validation.invalid')
    .min(10, 'organization.drawer.field.contactNumber.validation.minLength')
    .max(15, 'organization.drawer.field.contactNumber.validation.maxLength')
});

const organizationTypeNameSchema = string()
  .required('organization.drawer.field.organizationType.validation.required')
  .matches(nameFieldRegExpretion, 'organization.drawer.field.organizationType.validation.invalid')
  .max(30, 'organization.drawer.field.organizationType.validation.maxLength');

/**
 * Validation schema for vehicle creation.
 */
const vehicleCreateSchema = object().shape({
  vehiclenumber: string()
    .required('vehicle.drawer.field.vehicleNumber.validation.required')
    .matches(vehicleNumberRegExpretion, 'vehicle.drawer.field.vehicleNumber.validation.invalid')
    .max(10, 'vehicle.drawer.field.vehicleNumber.validation.maxLength'),
  emergencytype: string().required('vehicle.drawer.field.emergencyType.validation.required'),
  vehicleTypeId: string()
    .required('vehicle.drawer.field.vehicleType.validation.required')
    .matches(nameFieldRegExpretion, 'vehicle.drawer.field.vehicleType.validation.invalid')
    .max(30, 'vehicle.drawer.field.vehicleType.validation.maxLength'),
  fueltype: string().required('vehicle.drawer.field.fuelType.validation.required'),
  primary_number: string()
    .required('vehicle.drawer.field.primaryPhoneNumber.validation.required')
    .matches(contactNumberFieldRegExpretion, 'vehicle.drawer.field.primaryPhoneNumber.validation.invalid')
    .min(10, 'vehicle.drawer.field.primaryPhoneNumber.validation.minLength')
    .max(15, 'vehicle.drawer.field.primaryPhoneNumber.validation.maxLength'),
  secondary_number: string()
    .matches(contactNumberFieldRegExpretion, 'vehicle.drawer.field.secondaryPhoneNumber.validation.invalid')
    .min(10, 'vehicle.drawer.field.secondaryPhoneNumber.validation.minLength')
    .max(15, 'vehicle.drawer.field.secondaryPhoneNumber.validation.maxLength')
    .nullable(),
  chassis_number: string()
    .matches(vehicleNumberRegExpretion, 'vehicle.drawer.field.chassisNumber.validation.invalid')
    .max(20, 'vehicle.drawer.field.chassisNumber.validation.maxLength')
    .nullable(),
  engine_number: string()
    .matches(vehicleNumberRegExpretion, 'vehicle.drawer.field.engineNumber.validation.invalid')
    .max(20, 'vehicle.drawer.field.engineNumber.validation.maxLength')
    .nullable(),
  ordometer_reading: string()
    .matches(numberRegExpretion, 'vehicle.drawer.field.ordometerReading.validation.invalid')
    .max(10, 'vehicle.drawer.field.ordometerReading.validation.maxLength')
    .nullable()
});

/**
 * Validation schema for device creation.
 */
const deviceValidationSchema = object().shape({
  serialNumber: string()
    .required('device.drawer.field.serialNumber.validation.required')
    .matches(deviceSerialNumberRegExpression, 'device.drawer.field.serialNumber.validation.invalid')
    .min(3, 'device.drawer.field.serialNumber.validation.minLength')
    .max(20, 'device.drawer.field.serialNumber.validation.maxLength'),
  deviceName: string()
    .required('device.drawer.field.deviceName.validation.required')
    .matches(nameFieldRegExpretion, 'device.drawer.field.deviceName.validation.invalid')
    .min(3, 'device.drawer.field.deviceName.validation.minLength')
    .max(30, 'device.drawer.field.deviceName.validation.maxLength'),
  deviceType: string().required('device.drawer.field.deviceType.validation.required'),
  tenant: string().nullable(),
  vehicle: array()
});

export {
  changePasswordSchema,
  confirmPasswordSchema,
  deviceValidationSchema,
  forgotpwd,
  organizationCreateViewUpdateSchema,
  organizationTypeNameSchema,
  OTPvalidate,
  reactivateUserSchema,
  roleCreateSchema,
  signinSchema,
  tenantCreateSchema,
  unlockUserSchema,
  userCreateSchema,
  vehicleCreateSchema
};
