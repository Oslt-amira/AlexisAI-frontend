"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudyPlanOutput, getStudyPlan, parseStudyPlan } from "@/lib/planner";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const FormSchema = z.object({
  time_period: z.string(),
  work_range: z.string(),
  rest_range: z.string(),
  subject: z.string(),
});

interface PlannerFormProps {
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setPlanObject: React.Dispatch<React.SetStateAction<StudyPlanOutput | null>>;
  planObject: StudyPlanOutput | null;
}

export function PlannerForm({
  setError,
  setPlanObject,
  planObject,
}: PlannerFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setError(false);
    setIsLoading(true);
    setIsComplete(false);
    if (planObject) {
      setPlanObject(null);
    }
    await getStudyPlan(
      setPlan,
      setIsComplete,
      data.time_period,
      data.work_range,
      data.rest_range,
      data.subject,
    );
  }

  useEffect(() => {
    if (isComplete && plan) {
      setIsLoading(false);
      console.log("plan string : ", plan);
      console.log("parsed plan : ", parseStudyPlan(plan));
      const planObject = parseStudyPlan(plan);
      if (!plan) {
        setError(true);
      }
      setPlanObject(planObject ? planObject : null);
    }
  }, [isComplete]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full flex flex-wrap gap-x-12 gap-y-4">
          <FormField
            control={form.control}
            name="time_period"
            render={({ field }) => (
              <FormItem className="w-80">
                <FormLabel>Study period</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the duration of your study plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1 day">1 day</SelectItem>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Total duration for the study plan (e.g., 2 weeks).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="work_range"
            render={({ field }) => (
              <FormItem className="w-80">
                <FormLabel>Work range</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the duration of your work range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="4 hours">4 hours</SelectItem>
                    <SelectItem value="6 hours">6 hours</SelectItem>
                    <SelectItem value="8 hours">8 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Daily study hours allocation (e.g., 6 hours).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rest_range"
            render={({ field }) => (
              <FormItem className="w-80">
                <FormLabel>Rest range</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the duration of your study plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2 hour">2 hour</SelectItem>
                    <SelectItem value="4 hour">4 hour</SelectItem>
                    <SelectItem value="6 hour">6 hour</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Break time per day (e.g., 4 hour).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="w-80">
                <FormLabel>Study subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the duration of your study plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Probability theory">
                      Probability theory
                    </SelectItem>
                    <SelectItem value="Quantum physics">
                      Quantum physics
                    </SelectItem>
                    <SelectItem value="Linear algebra">
                      Linear algebra
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The subject to focus on (e.g., Probability).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Start Planning"}
        </Button>
      </form>
    </Form>
  );
}
