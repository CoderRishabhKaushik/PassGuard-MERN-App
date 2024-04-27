import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const getPasswords = async () => {
    let req = await fetch(`http://localhost:3000/`);
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);
  // for show password or hide password function
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  
// Frontend Code - savePassword function
const savePassword = async () => {
  if (!form.site || !form.username || !form.password) {
    toast.warn("Please fill all inputs");
    return;
  }

  try {
    if (isEditing) {
      const response = await fetch(`http://localhost:3000/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password Updated Successfully!");
    } else {
      const newId = uuidv4(); 
      const response = await fetch(`http://localhost:3000/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: newId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save password");
      }

      toast.success("Password Saved Successfully!");
    }

    // Clear the form fields and reset state
    setform({ site: "", username: "", password: "" });
    setIsEditing(false);

    // Optionally, you might want to refresh passwordArray after successful save/update
    getPasswords();
  } catch (error) {
    console.error(error);
    toast.error("Failed to save password. Please try again.");
  }
};

  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id);
    let c = confirm("Do you really want to delete this password?");
    if (c) {
        try {
            // Send DELETE request with the password ID in the URL
            await fetch(`http://localhost:3000/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            // Update the password array after successful deletion
            setPasswordArray(passwordArray.filter((item) => item.id !== id));
            toast.success("Password Deleted Successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete password. Please try again.");
        }
    }
};


  const editPassword = (id) => {
    setform({ ...passwordArray.filter((i) => i.id === id)[0], id: id });
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
    console.log()
    toast.info("Editing password...");
    setIsEditing(true);
  };


  const coptText = (text) => {
    toast.success(" Text copied to clipboard");
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="flex flex-col p-4  m-8 overflow-auto ">
        <p className="mb-8 text-xl text-blue-500 font-bold text-center">
          Welcome to the PassGuard
        </p>
        <div className="flex flex-col flex-wrap justify-center ">
          <input
            type="text"
            placeholder="Enter Website URL"
            className="border-2 pl-2 border-black  mb-4 rounded-sm  h-[3rem]"
            value={form.site}
            onChange={handlechange}
            name="site"
          />
          <div className="flex justify-center text-center flex-wrap gap-4 w-full ">
            <input
              type="text"
              placeholder="Enter Email"
              value={form.username}
              onChange={handlechange}
              name="username"
              className="border-2 pl-2 border-black rounded-sm w-[45%] h-[3rem]"
            />
            <div className="flex  justify-center items-center text-center relative  w-[50%]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={form.password}
                name="password"
                onChange={handlechange}
                className="border-2 pl-2 border-black rounded-sm mr-2 pr-10 w-[100%] h-[3rem]"
              />
              <button
                onClick={handleTogglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={savePassword}
              className="flex justify-center items-center text-black mt-4 bg-white border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300  rounded-lg text-sm w-[9rem] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 font-bold hover:bg-blue-400"
            >
              {" "}
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              Save
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-6">
          <p className="text-xl text-blue-500 font-bold text-left">
            Your Passwords :
          </p>
          {passwordArray.length === 0 && (
            <div className="text-sm"> No Passowords</div>
          )}
          {passwordArray.length !== 0 && (
            <div className="overflow-x-auto ">
              <table className="table-auto w-full rounded-md overflow-hidden">
                <thead className="bg-blue-500 text-black">
                  <tr>
                    <th className="p-2"> SNo.</th>
                    <th className="p-2">Site</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Password</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-blue-200">
                  {passwordArray.map((item, index) => {
                    return (
                      <tr key={index} className="border-b-2 border-white">
                        <td className="py-2 border-r-2 border-white text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 border-r-2 border-white text-center">
                          <div className="flex item-center justify-center">
                            <span>
                              <a
                                href={item.site}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.site}
                              </a>
                            </span>

                            <div
                              className="size-7 cursor-pointer "
                              onClick={() => {
                                coptText(item.site);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/depeqmsz.json"
                                trigger="hover"
                                style={{ width: "25px", height: "25px" }}
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-r-2 border-white text-center ">
                          <div className="flex item-center justify-center">
                            <span> {item.username}</span>
                            <div
                              className="size-7 cursor-pointer"
                              onClick={() => {
                                coptText(item.username);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/depeqmsz.json"
                                trigger="hover"
                                style={{ width: "25px", height: "25px" }}
                              ></lord-icon>
                            </div>{" "}
                          </div>
                        </td>
                        <td className="py-2 border-r-2 border-white text-center">
                          <div className="flex item-center justify-center">
                            <span>{"*".repeat(item.password.length)}</span>
                            <div
                              className="size-7 cursor-pointer"
                              onClick={() => {
                                coptText(item.password);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/depeqmsz.json"
                                trigger="hover"
                                style={{ width: "25px", height: "25px" }}
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-r-2 border-white text-center">
                          <div className="flex items-center justify-center">
                            <MdEdit
                              className="mr-2 cursor-pointer text-2xl"
                              onClick={() => {
                                editPassword(item.id);
                              }}
                            />
                            <MdDelete
                              className="cursor-pointer text-2xl"
                              onClick={() => {
                                deletePassword(item.id);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Manager;
