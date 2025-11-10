'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Fixed import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUserName } from "@/actions/users";
import { BarLoader, BeatLoader } from "react-spinners";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [origin, setOrigin] = useState("");
  const router = useRouter(); // Now this will work

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    if (isLoaded && user?.username) {
      setValue("username", user.username);
    }
  }, [isLoaded, user?.username, setValue]);

  const { 
    loading, 
    error, 
    data,
    fn: fnUpdateUsername
  } = useFetch(updateUserName);
  
  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  //  Success ke baad proper reload
  useEffect(() => {
    if (data?.success) {
      const handleReload = async () => {
        // Clerk session reload
        await user?.reload();
        
        // Router refresh (Next.js cache clear)
        router.refresh();
        
        // Hard reload after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
      
      handleReload();
    }
  }, [data, user, router]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}!</CardTitle>
        </CardHeader>
        {/* Latest Updates */}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{origin}/</span>
                <Input 
                  {...register("username")} 
                  placeholder="username" 
                  disabled={loading}
                  className="flex-1"
                />
              </div>
              
              {/* Current username display */}
              <p className="text-xs text-gray-500 mt-2">
                Current: <span className="font-semibold text-blue-600">
                  {user?.username || "Not set"}
                </span>
              </p>
              
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
              {data?.success && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-2">
                  <span>✅ Username updated successfully!</span>
                  <BeatLoader size={8} color="#16a34a" />
                </p>
              )}
            </div>
            
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#4A90E2" /> 
            )}
            
            <Button type="submit" disabled={loading}>
              {loading ? <BeatLoader size={10} color="white" /> : "Update Username"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;