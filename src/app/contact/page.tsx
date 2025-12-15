"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Section } from '@/components/layout/PageLayout';
import { PRIMARY_COLOR } from "@/lib/theme";

const formSchema = z.object({
  companyName: z.string().min(1, { message: "会社名を入力してください。" }),
  contactPerson: z.string().min(1, { message: "担当者名を入力してください。" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
  scale: z.string().optional(),
  message: z.string().min(10, { message: "メッセージは10文字以上で入力してください。" }),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      scale: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to a server
    toast.success("お問い合わせありがとうございます。", {
      description: "内容を確認の上、担当者よりご連絡いたします。",
    });
    form.reset();
  }

  return (
    <div>
      <PageHeader title="お問い合わせ" subtitle="導入のご相談、お見積もりなど、お気軽にご連絡ください" />
      <Section className="border-t border-white/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
            <div className="bg-black/40 backdrop-blur-md border border-primary/20 rounded-lg p-8 md:p-12 shadow-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* 基本情報セクション */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-primary mb-6 pb-3 border-b border-primary/30">
                      基本情報
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-foreground mb-2 block">
                            会社名 <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="スターシーズ株式会社" 
                              className="h-12 text-base bg-black/50 border-primary/30 focus:border-primary focus:ring-primary/50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-foreground mb-2 block">
                            担当者名 <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="蓄電 太郎" 
                              className="h-12 text-base bg-black/50 border-primary/30 focus:border-primary focus:ring-primary/50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-foreground mb-2 block">
                            メールアドレス <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="contact@starseeds.com" 
                              className="h-12 text-base bg-black/50 border-primary/30 focus:border-primary focus:ring-primary/50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-foreground mb-2 block">
                            検討中の規模 (MW級)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="10" 
                              className="h-12 text-base bg-black/50 border-primary/30 focus:border-primary focus:ring-primary/50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* お問い合わせ内容セクション */}
                  <div className="space-y-6 pt-4 border-t border-primary/20">
                    <h3 className="text-lg font-bold text-primary mb-6 pb-3 border-b border-primary/30">
                      お問い合わせ内容
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-foreground mb-2 block">
                            メッセージ <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="お問い合わせ内容を具体的にご記入ください..."
                              className="resize-none text-base bg-black/50 border-primary/30 focus:border-primary focus:ring-primary/50 min-h-[160px]"
                              rows={8}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 送信ボタン */}
                  <div className="pt-6 border-t border-primary/20">
                    <Button 
                      type="button"
                      disabled
                      className="w-full md:w-auto min-w-[200px] h-12 text-base font-semibold opacity-50 cursor-not-allowed"
                    >
                      準備中
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </Section>
    </div>
  );
}
