import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExitForm from "../../../Components/operator/ExitForm";
import CostHandler from "../../../Components/operator/CostHandler";
import { exitByOTP, exitByPhone, exitByPlate } from "../../../api/vehicleExit";
import { confirmPayment } from "../../../api/confirmPayment";
import ParkingSessions from "../../../Components/server/tables/ParkingSessionsDataGrid";
export default function OperatorExitCar() {
  const [exitLoading, setExitLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [costModalOpen, setCostModalOpen] = useState(false);
  const [cost, setCost] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");

  const handleExitSubmit = async (data: {
    phone?: string;
    plate?: string;
    exitCode?: string;
  }) => {
    try {
      setExitLoading(true);
      let res;

      if (data.phone) {
        res = await exitByPhone({ phoneNumber: data.phone });
      } else if (data.exitCode) {
        res = await exitByOTP({ otp: data.exitCode });
      } else if (data.plate) {
        res = await exitByPlate({ plateNumber: data.plate });
      }
      console.log("🚀 ~ handleExitSubmit ~ res:", res);

      if (!res?.success) {
        toast.error(res?.message || "خطا");
        return;
      }

      setCost(res.data.cost);
      setSessionId(res.data.sessionId);
      setCostModalOpen(true);

      toast.success("خروج ثبت شد");
    } catch (error: any) {
      console.log(error?.response?.data?.message);

      toast.error(error?.response?.data?.message);
    } finally {
      setExitLoading(false);
    }
  };

  const handleConfirmPayment = async ({
    sessionId,
    paymentMethod,
  }: {
    sessionId: string;
    paymentMethod: "CASH" | "CARD";
  }) => {
    try {
      setPaymentLoading(true);
      const res = await confirmPayment({ sessionId, paymentMethod });

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setRefresh((prev)=>prev+1)
      toast.success("پرداخت ثبت شد ✅");
      setCostModalOpen(false);
    } catch {
      toast.error("خطا در پرداخت");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <ExitForm onSubmit={handleExitSubmit} loading={exitLoading} />

        <CostHandler
          open={costModalOpen}
          cost={cost}
          sessionId={sessionId}
          loading={paymentLoading}
          onClose={() => setCostModalOpen(false)}
          onConfirm={handleConfirmPayment}
        />
        </div>
        <div className="max-md:w-[90vw] mt-4 w-auto overflow-x-auto ">
        <ParkingSessions refresh={refresh}/>
        </div>
    </>
  );
}
