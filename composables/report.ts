import * as z from 'zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

export interface ReportFormInit {
  sourceCity?: string;
  name?: string;
  targetCity?: string;

  onSubmitSuccess?: () => void;
}

export function useReportForm(init: ReportFormInit) {
  const store = useLatestLogs();

  const formSchema = toTypedSchema(
    z.object({
      sourceCity: z.string(),
      name: z.string(),
      targetCity: z.string(),
      price: z.number().gt(0),
      percent: z.array(z.number().gt(0).lt(200)),
      trend: z.enum(['up', 'same', 'down'])
    })
  );

  const form = useForm({
    initialValues: {
      sourceCity: init.sourceCity,
      name: init.name,
      targetCity: init.targetCity,
      percent: [100],
      trend: 'same'
    },
    validationSchema: formSchema
  });

  // watch(open, (open) => {
  //   if (open) {
  //     form.resetForm();
  //   }
  // });

  const product = computed(() => {
    if (!form.values.sourceCity || !form.values.name) return undefined;
    return getProductInfo(form.values.sourceCity, form.values.name);
  });

  watch(
    () => [product.value, form.values.targetCity] as const,
    ([product, target], prev) => {
      if (!product || !target) return;

      if (form.isFieldDirty('price') || form.isFieldDirty('percent')) return;

      const source = product.city;
      const name = product.name;

      // 使用最新日志
      const latest = store.getLatestLog(source, name, target);
      if (latest) {
        form.resetField('price', { value: latest.price });
        form.resetField('percent', { value: [latest.percent] });
        form.resetField('trend', { value: latest.trend });
        return;
      }

      // 使用基础数据
      if (source === target) {
        form.resetField('price', { value: product.basePrice });
      } else {
        const tr = product.transactions.find((tr) => tr.targetCity === target);
        if (tr) {
          form.resetField('price', { value: tr.basePrice });
        }
      }
    },
    { immediate: true }
  );

  watch(
    () => [product.value, form.values.targetCity, form.values.price] as const,
    ([product, target, price], prev) => {
      if (!product) return;

      // @ts-ignore
      if (price === '') {
        form.setFieldValue('price', undefined);
        return;
      }

      if (price === undefined) return;
      if (!form.values.targetCity) return;
      if (form.isFieldDirty('percent')) return;

      if (target === product.city) {
        const percent = Math.round((100 * price) / product.basePrice);
        if (percent > 0 && percent < 200) {
          form.resetField('percent', { value: [percent] });
        }
      } else {
        const transaction = product.transactions.find(
          (tr) => tr.targetCity === form.values.targetCity
        );
        if (transaction && transaction.basePrice > 0) {
          const percent = Math.round((100 * price) / transaction.basePrice);
          if (percent > 0 && percent < 200) {
            form.resetField('percent', { value: [percent] });
          }
        }
      }
    }
  );

  watch(
    () => [product.value, form.values.targetCity, form.values.percent] as const,
    ([product, target, percent], prev) => {
      if (!product) return;

      if (target === prev[0] && percent?.[0] === prev[1]?.[0]) return;

      if (percent === undefined) return;
      if (form.isFieldDirty('price')) return;
      if (!form.values.targetCity) return;
      const transaction = product.transactions.find(
        (tr) => tr.targetCity === form.values.targetCity
      );

      if (target === product.city) {
        const price = Math.round((percent[0] / 100.0) * product.basePrice);
        if (price > 0) {
          form.resetField('price', { value: price });
        }
      } else {
        if (transaction && transaction.basePrice > 0) {
          const price = Math.round((percent[0] / 100.0) * transaction.basePrice);
          if (price > 0) {
            form.resetField('price', { value: price });
          }
        }
      }
    }
  );

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (!form.values.sourceCity || !form.values.name) {
        toast.error(`未找到商品 ${form.values.sourceCity} - ${form.values.name}`);
        return;
      }
      const product = getProductInfo(form.values.sourceCity, form.values.name);
      if (!product) {
        toast.error(`未找到商品 ${form.values.sourceCity} - ${form.values.name}`);
        return;
      }

      const basePrice =
        values.sourceCity === values.targetCity
          ? /* 买入 */ product.basePrice
          : /* 卖出 */ product.transactions.find((tr) => tr.targetCity === values.targetCity)
              ?.basePrice;
      if (basePrice !== undefined) {
        const price = values.price;
        const percent = values.percent[0]!;
        const eps = Math.max(5, Math.round(basePrice / 100));
        const expetecdPrice = Math.round((basePrice * percent) / 100);
        if (Math.abs(price - expetecdPrice) > eps) {
          toast.error(`请确认数据是否有误?`, {
            description: `价格偏差过大, 期望价格范围: [${expetecdPrice - eps}, ${expetecdPrice + eps}]`
          });
          form.resetField('price');
          form.resetField('percent');
          return;
        }
      }

      await $fetch(`/api/log`, {
        method: 'POST',
        body: {
          name: values.name,
          sourceCity: values.sourceCity,
          targetCity: values.targetCity,
          type: values.sourceCity !== values.targetCity ? 'sell' : 'buy',
          trend: values.trend,
          price: values.price,
          percent: values.percent[0],
          uploadedAt: new Date().getTime()
        }
      });

      toast.success(`上报成功`);
      store.fetch();

      init.onSubmitSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(`上报失败`);
    }
  });

  return { form, onSubmit };
}
