import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useCreateOrUpdateCabin } from "./useCreateOrUpdateCabin";

const CabinFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

//CabinForm 同时用于 create cabin 和 edit/update cabin
function CabinForm({ cabin }) {
  // 如果传入了 props 'cabin', 那么说明是要 edit/update cabin
  const isUpdate = Boolean(cabin);
  const { mutate, isPending } = useCreateOrUpdateCabin(isUpdate);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: isUpdate ? cabin : {} }); //defaultValues 是一个 object, 用于填充同名的 form field

  // 注意: 下面的 onSubmit 是给 handleSubmit 调用的 callback, 其参数为 formDataObj, 而非 html onSubmit 所接收的 event
  function onSubmit(formDataObj) {
    console.log(`提交的表单数据为:`);
    console.log(formDataObj);
    // 根据 https://tanstack.com/query/v4/docs/framework/react/reference/useMutation 可知:
    // mutate 第一个参数是 variables, 是一个 object, 会被传递给 mutationFn
    // mutate 第二个参数是 object (里面可以指定 onSuccess / onSettled / onError)
    let payload;
    if (isUpdate) {
      // 如果是 edit/update cabin, 由于 cabin form 中并没有 field 'id'
      // 因此这里需要将 id 塞进 formDataObj 如下:
      payload = { ...formDataObj, id: cabin.id };
      console.log(`editing cabin with payload:`);
    } else {
      // 如果是 create cabin, formDataObj 内没有 id
      payload = formDataObj;
      console.log(`creating cabin with payload:`);
    }
    console.log(payload);
    mutate(payload, {
      onSuccess: () => {
        // 重置表单
        // 如果 useForm({defaultValues: xxxObj}), 那么 reset() 将按照 xxxObj 进行重置
        // 如果不满意, 可以 reset(yyyObj), 此时将按照 yyyObj 进行重置
        // 此时: 如果想重置 input with name 'name', 就 reset({name: ''})
        reset();
      },
    });
  }
  function onError(errorObj) {
    console.log(`检测到的表达错误为:`);
    console.log(errorObj);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <CabinFormRow>
        <Label htmlFor="name">Name</Label>
        {/* 参考 https://react-hook-form.com/docs/useform/register 可知: */}
        {/* required 的值可以是 true/false, 也可以是 {value: true/false, message: 'xxx'} */}
        {/* 其实前者就是后者的一种特例, 相当于 {value: true/false, message: ''} */}
        {/* 下面 error message 为 '' */}
        {/* <Input type="text" {...register("name", { required: true })} /> */}
        {/* 下面 error message 为指定的内容 */}
        <Input
          type="text"
          {...register("name", {
            required: {
              value: true,
              message: "value is required for this field",
            },
          })}
        />

        {/* 额外安装 @hookform/error-message 后, 可以使用 ErrorMessage 来展示 field error  */}
        {/* 参考 https://react-hook-form.com/docs/useformstate/errormessage */}
        {/* 第一种展示方式: 在 devtools 中发现其实就是将 text 原封展示出来, 没有任何元素包裹, 也没有任何样式*/}
        {/* <ErrorMessage errors={errors} name="name" /> */}
        {/* 第二种展示方式: 借助 render 自定义渲染 error message */}
        {/* 注意: render 是一个 function, 其参数为 errors.name 对应的 error object, 需要解构才能拿到其中的 message */}
        {/* 因此 render function 应该指定为 ({ message }) => <Error>{message}</Error> 而非想象的 (errMsg) => <Error>{errMsg}</Error> */}
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <Error>{message}</Error>}
        />
      </CabinFormRow>

      <CabinFormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          defaultValue={1}
          {...register("maxCapacity", {
            required: {
              value: true,
              message: "value is required for this field",
            },
            min: {
              value: 1,
              message: "max capacity should be between 1 and 10!",
            },
            max: {
              value: 10,
              message: "max capacity should be between 1 and 10!",
            },
            // 实测发现: type 为 number 的 input 可以输入 01 这样的内容,  前置 0 是允许的
            // 最终会将 maxCapacity: '01' 提交给后台, 但后台会报错, 因此, 需要借助 valueAsNumber 进行转换
            // 这样最终会将 maxCapacity: 1 提交给后台, 后台不再报错
            // 由此可知: react-hook-form 不仅提供了 field validation 还提供了 field validation 之前所需的 field convertion
            valueAsNumber: true,
          })}
        />
        <ErrorMessage
          errors={errors}
          name="maxCapacity"
          render={(errorObj) => <Error>{errorObj.message}</Error>}
        />
      </CabinFormRow>

      <CabinFormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          {...register("regularPrice", {
            required: {
              value: true,
              message: "value is required for this field",
            },
            max: {
              value: 1000,
              message: "price should at most be 1000",
            },
            min: {
              value: 1,
              message: "price should at least be 1",
            },
            valueAsNumber: true,
          })}
        />
        <ErrorMessage
          errors={errors}
          name="regularPrice"
          render={({ message }) => <Error>{message}</Error>}
        />
      </CabinFormRow>

      <CabinFormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          defaultValue={0}
          {...register("discount", {
            required: {
              value: true,
              message: "value is required for this field",
            },
            valueAsNumber: true,
            // https://react-hook-form.com/docs/useform/register 中并没有提到 validate 对应的 function 的 signature 是什么样的
            // 查看如下源码:
            // RegisterOptions
            // https://github.com/react-hook-form/react-hook-form/blob/85684f930c520310da51fec382c8b30f6da11502/src/types/validator.ts#L27
            // 可知 validate 的值可以是 Validate 类型
            // 继续查看源码:
            // Validate
            // https://github.com/react-hook-form/react-hook-form/blob/85684f930c520310da51fec382c8b30f6da11502/src/types/validator.ts#L22
            // 可知 Validate 的 shape 如下:
            // export type Validate<TFieldValue, TFormValues> = (
            //   value: TFieldValue,
            //   formValues: TFormValues,
            // ) => ValidateResult | Promise<ValidateResult>;
            // export type ValidateResult = Message | Message[] | boolean | undefined;
            // export type Message = string;
            // 由此可知, validate 的值如果是 function, 那么:
            // - 参数分别是: fieldValue 和 formValues (实测是一个 object)
            // - 返回值是: boolean / string (充当 error message)
            validate: (fieldValue, formValues) => {
              // console.log(`fieldValue: `);
              // console.log(fieldValue);
              // console.log(`formValues: `);
              // console.log(formValues);
              const discount = fieldValue;
              const regularPrice = formValues.regularPrice;
              return (
                discount < regularPrice || "discount should be less than price"
              );
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="discount"
          render={({ message }) => <Error>{message}</Error>}
        />
      </CabinFormRow>

      <CabinFormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea
          type="number"
          defaultValue=""
          {...register("description", {
            required: {
              value: true,
              message: "value is required for this field",
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="description"
          render={({ message }) => <Error>{message}</Error>}
        />
      </CabinFormRow>

      <CabinFormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isUpdate
              ? false // edit/update cabin 时, defaultValues 会填充 formDataObj.image, 但 field input 'image' 是没有值的, 无法通过校验
              : {
                  value: true,
                  message: "value is required for this field",
                },
          })}
        />
      </CabinFormRow>

      <CabinFormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isPending}>{isUpdate ? "Edit" : "Add"}</Button>
      </CabinFormRow>
    </Form>
  );
}

export default CabinForm;
