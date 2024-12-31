// import { reactive, watch } from 'vue';
// import cloneDeep from 'lodash.clonedeep';
// import isEqual from 'lodash.isequal';

// export default function useForm(fields) {
//   let defaults = fields;
//   let recentlySuccesfulTimeoutId;

//   const form = reactive({
//     fields: cloneDeep(fields),
//     errors: {},
//     dirty: false,
//     hasErrors: false,
//     processing: false,
//     wasSuccesful: false,
//     recentlySuccesful: false,

//     async submit(submitFn, hooks = {}) {
//       if (this.processing) return;

//       const _hooks = {
//         onBefore: async () => {
//           this.processing = true;
//           this.wasSuccesful = false;
//           this.recentlySuccesful = false;
//           clearTimeout(recentlySuccesfulTimeoutId);
//         },
//         onSuccess: async (response) => {
//           this.clearErrors();
//           this.wasSuccesful = true;
//           this.recentlySuccesful = true;

//           recentlySuccesfulTimeoutId = setTimeout(() => {
//             this.recentlySuccesful = false;
//           }, 2000);

//           if (hooks.onSuccess) {
//             await hooks.onSuccess(response);
//           }

//           defaults = cloneDeep(this.fields);
//         },
//         onError: async (error) => {
//           this.hasErrors = true;

//           if (error?.status === 422) {
//             this.clearErrors();
//             this.setErrors(error.data?.errors);

//             if (hooks.onError) {
//               await hooks.onError(error);
//             }
//           }
//         },
//         onFinish: async () => {
//           this.processing = false;

//           if (hooks.onFinish) {
//             await hooks.onFinish();
//           }
//         }
//       };

//       await _hooks.onBefore();

//       try {
//         const response = await submitFn(this.fields);
//         await _hooks.onSuccess(response);
//       } catch (error) {
//         await _hooks.onError(error);
//       } finally {
//         await _hooks.onFinish();
//       }
//     },
//     reset(...fields) {
//       const clonedDefaults = cloneDeep(defaults);

//       if (fields.length === 0) {
//         this.fields = clonedDefaults;
//       } else {
//         fields.forEach((field) => {
//           if (clonedDefaults[field] !== undefined) {
//             this.fields[field] = clonedDefaults[field];
//           }
//         });
//       }
//     },
//     clearErrors(...fields) {
//       if (fields.length === 0) {
//         this.errors = {};
//       } else {
//         fields.forEach((field) => delete this.errors[field]);
//       }
//     },
//     setErrors(errors) {
//       this.errors = {
//         ...this.errors,
//         ...errors
//       };

//       this.hasErrors = Object.keys(this.errors).length > 0;
//     }
//   });

//   watch(
//     () => form.fields,
//     () => {
//       form.dirty = !isEqual(form.fields, defaults);
//     },
//     { immediate: true, deep: true }
//   );

//   return form;
// }
