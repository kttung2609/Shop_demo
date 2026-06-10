import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, LoaderCircle, AlertCircle, ArrowRight } from "lucide-react";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực email...");

  useEffect(() => {
    let cancelled = false;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Thiếu mã xác thực email.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/auth/verify-email/${token}`);
        const data = await res.json();

        if (cancelled) return;

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Xác thực email thành công.");
        } else {
          setStatus("error");
          setMessage(data.message || "Không thể xác thực email.");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Không thể kết nối tới máy chủ xác thực.");
        }
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="verify-page">
      <div className={`verify-card ${status}`}>
        <div className={`verify-icon ${status}`}>
          {status === "loading" && <LoaderCircle size={36} className="spin" />}
          {status === "success" && <CheckCircle2 size={36} />}
          {status === "error" && <AlertCircle size={36} />}
        </div>

        <h1>{status === "success" ? "Email đã được xác thực" : status === "error" ? "Xác thực thất bại" : "Đang xác thực..."}</h1>
        <p>{message}</p>

        <div className="verify-actions">
          <button className="verify-primary" type="button" onClick={() => navigate("/login")}>
            Đi đến đăng nhập
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;