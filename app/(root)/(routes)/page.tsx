"use client";
import AcmeLogo from '@/app/ui/acme-logo';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect } from 'react';


const SetupPage = ()=> {
  const onOpen = useStoreModal((state)=> state.onOpen);
  const isOpen = useStoreModal((state)=>state.isOpen);
  useEffect(()=>{
    if (!isOpen){
      onOpen();
    }
  },[isOpen,onOpen]);

  return null;
}
export default SetupPage;