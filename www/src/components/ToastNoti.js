import React from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const ToastNoti = ({ message, type = 'success', position = 'bottom-right', autoClose = 4000 }) => {
  
  // Hàm để hiển thị thông báo
  const showToast = () => {
    // Kiểm tra position có hợp lệ không
    const validPositions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
      'center'
    ];

    // Kiểm tra và lấy vị trí hợp lệ
    const toastPosition = validPositions.includes(position.toLowerCase()) 
      ? position.toLowerCase() // Vị trí phải là chuỗi (không phải toast.POSITION)
      : 'bottom-right';  // Nếu không hợp lệ, dùng mặc định bottom-right

    // Hiển thị thông báo dựa trên type
    switch (type) {
      case 'success':
        toast.success(message, {
          position: toastPosition, 
          autoClose: autoClose,
        });
        break;
      case 'error':
        toast.error(message, {
          position: toastPosition,
          autoClose: autoClose,
        });
        break;
      case 'info':
        toast.info(message, {
          position: toastPosition,
          autoClose: autoClose,
        });
        break;
      case 'warning':
        toast.warning(message, {
          position: toastPosition,
          autoClose: autoClose,
        });
        break;
      default:
        toast(message, {
          position: toastPosition,
          autoClose: autoClose,
        });
        break;
    }
  };

  React.useEffect(() => {
    showToast();
  }, [message, type, position, autoClose]);

  return (
    <ToastContainer
      position="top-right" // Vị trí mặc định là top-right
      style={{ marginTop: '60px' }} // Đẩy thông báo xuống một chút
    />
  );
};

export default ToastNoti;
