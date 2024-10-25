import { useState } from 'react';
import Swal from 'sweetalert2';
import XLSX from 'sheetjs-style';
import * as FileSaver from 'file-saver';

const NumberPattern = /^\d{10}$/;
const PassWordPattern = '"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
const letters = '^[A-Za-z _]*[A-Za-z][A-Za-z _]{2,}$';
const RegExNum = /^[0-9]*$/;
const Mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

export const getBaseURL = () => {
    let baseURL = 'https://api.hellaviews.com';
    if (process.env.REACT_APP_NODE_ENV === 'development') {
        baseURL = 'http://localhost:8001';
    } else if (process.env.REACT_APP_NODE_ENV === 'stage') {
        baseURL = 'https://stage.hellaviews.com';
    }
    return baseURL;
};

export const useSetState = (initialState: any) => {
    const [state, setState] = useState(initialState);

    const newSetState = (newState: any) => {
        setState((prevState: any) => ({ ...prevState, ...newState }));
    };
    return [state, newSetState];
};

export const validateEmail = (email: string) => {
    return Mail.test(email);
};

export const validateString = (string: string) => {
    if (string.match(letters)) {
        return true;
    }
    return false;
};

export const isUrlFound = (url: any) => {
    if (/^https:\/\//.test(url)) {
        return true;
    } else if (/^file:\/\//.test(url)) {
        return true;
    } else {
        return false;
    }
};

export const getFileData = (file: any) => {
    const filePathArray = file.path.split('/');
    const fileName = filePathArray.pop();
    return { name: fileName, uri: file.path, type: file.mime };
};

export const checkLength = (length: any) => {
    if (length < 10) {
        return '000' + (length + 1).toString();
    } else if (length < 100) {
        return '00' + (length + 1).toString();
    } else if (length < 1000) {
        return '0' + (length + 1).toString();
    } else return length;
};

export const capitalizeFLetter = (string = '') => {
    if (string.length > 0) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
};

export const Success = (message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        // Merge provided options with default options
    });

    toast.fire({
        icon: 'success',
        title: message,
        padding: '10px 20px',
    });
};

export const Failure = (message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        // Merge provided options with default options
    });

    toast.fire({
        icon: 'error',
        title: message,
        padding: '10px 20px',
    });
};

export const downloadExlcel = (excelData: any, fileName: any) => {
    const filetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8';
    const fileExtension = '.csv';
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
    const data = new Blob([excelBuffer], { type: filetype });
    FileSaver.saveAs(data, fileName + fileExtension);
};

export const objIsEmpty = (obj: object) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }
    return true;
};

export const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const Dropdown = (arr: any, label: string) => {
    const array = arr?.map((item) => ({ value: item?.id, label: item[label] }));
    return array;
};

export const formatDateTimeLocal = (dateString: any) => {
    const date: any = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
};

export const getFileNameFromUrl = (url) => {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename;
};
export const isValidImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => url?.toLowerCase().endsWith(ext));
};

export const uniqueState = (arr) => {
    const uniqueChoices = arr?.reduce((acc, current) => {
        if (!acc.some((item) => item?.raw === current?.raw)) {
            acc.push(current);
        }
        return acc;
    }, []);
    return uniqueChoices;
};

export const getKey = (imageUrl) => {
    const key = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    return key;
};

export const getMonthNumber = (dateString) => {
    const date = new Date(dateString);

    const monthNumber = date.getMonth() + 1;
    return monthNumber;
};

export const getImageSizeIntoKB = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        const contentLength: any = response.headers.get('Content-Length');

        if (contentLength) {
            const sizeInKB = contentLength / 1024; // Convert bytes to KB
            return sizeInKB.toFixed(2); // Return size as a string with 2 decimal points
        } else {
            console.log('Unable to retrieve content length.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching the image:', error);
        return null;
    }
};

export const generateColors = (numColors: number): string[] => {
    const colors = [];
    const hueStep = 360 / numColors;

    for (let i = 0; i < numColors; i++) {
        const hue = Math.round(i * hueStep);
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }

    return colors;
};

export const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options.push(timeString);
        }
    }
    options.push('24:00'); // Add the final option
    // return Dropdown(options);
};

export const formatTime = (time) => {
    const formattedTime = `${time.slice(0, 5)}`;
    const dropdownFormat = { value: formattedTime, label: formattedTime };
    return dropdownFormat;
};

export const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;
    return regex.test(url);
};

export const addCommasToNumber = (value) => {
    let values = null;
    if (typeof value === 'number') {
        values = value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    } else {
        values = value;
    }
    return values;
};


export const showDeleteAlert = (onConfirm, onCancel, title) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn confirm-btn", // Add a custom class for the confirm button
        cancelButton: "btn cancel-btn", // Add a custom class for the cancel button
        popup: "sweet-alerts",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: title ? title : "Are you sure to cancel order?",
        // text: "You won't be able to Delete this!",
        icon: "warning",
        showCancelButton: true,
        // confirmButtonText: 'Yes, delete it!',
        // cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        padding: "2em",
      })
      .then((result) => {
        if (result.isConfirmed) {
          onConfirm(); // Call the onConfirm function if the user confirms the deletion
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          onCancel(); // Call the onCancel function if the user cancels the deletion
        }
      });
  };
  