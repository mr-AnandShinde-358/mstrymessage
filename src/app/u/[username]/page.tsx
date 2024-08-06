"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)

  const sessgestMessages =["What's your favorite movie?","Do you have any pets?","What's your dream job?"]

  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post(`/api/send-message`, {
        username: params.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      console.error("Error in sending message of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Error in sending message of user";

      toast({
        title: "sending message failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const fetchSuggestedMessages =()=>{}
  const  handleMessageClick=(message:any)=>{
    console.log(message)
    form.reset({ ...form.getValues(), content: message })
  }
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write your Annoymous message here..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setMessageContent(e.target.value);
                    }}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
           
         
            {
                   sessgestMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
            }

            
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default page;
