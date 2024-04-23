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

  //for submit add password button function
  // const savePassword = () => {
  //   if (!form.site || !form.username || !form.password) {
  //     toast.warn("Please fill all inputs");
  //     return;
  //   }
  //   if (isEditing) {
  //     toast.success("Password Updated Successfully!");
  //     setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
  //     localStorage.setItem(
  //       "password",
  //       JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
  //     );
  //   } else {
  //     toast.success("Password Saved Successfully!");
  //     setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
  //     localStorage.setItem(
  //       "password",
  //       JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
  //     );
  //   }
  //   // console.log([...passwordArray, form]);
  //   setform({ site: "", username: "", password: "" });
  //   setIsEditing(false);
  // };
  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) {
      toast.warn("Please fill all inputs");
      return;
    }
    
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      const newId = uuidv4(); // Generate a new unique id
      
      // Send POST request to add the new password to the database
      await fetch(`http://localhost:3000/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: newId }),
      });
      
      // Update passwordArray state with the new password
      setPasswordArray([...passwordArray, { ...form, id: newId }]);
      
      // Clear the form fields
      setform({ site: "", username: "", password: "" });
      
      toast.success("Password Saved Successfully!");
    } else {
      toast.warn(
        "Error: Password not saved! Please enter a minimum of 3 digits in all fields."
      );
    }
  };
  

  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id);
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));

      await fetch(`http://localhost:3000/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.success("Password Deleted Successfully!");
    }
  };

  const editPassword = (id) => {
    setform({ ...passwordArray.filter((i) => i.id === id)[0], id: id });
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
    console.log()
    toast.info("Editing password...");
    setIsEditing(true);
  };

  // const deletePassword = (id) => {
  //   let con = confirm("Do you want to delete this item ?");
  //   if (con) {
  //     toast.success("Password Deleted Successfully!");
  //     setPasswordArray(passwordArray.filter((item) => item.id !== id));
  //     localStorage.setItem(
  //       "password",
  //       JSON.stringify(passwordArray.filter((item) => item.id !== id))
  //     );
  //   }
  // };

  // const editPassword = (id) => {
  //   setIsEditing(true);
  //   toast.info("Editing password...");
  //   const passwordToEdit = passwordArray.find((item) => item.id === id);
  //   if (!passwordToEdit) return;
  //   setform({
  //     site: passwordToEdit.site,
  //     username: passwordToEdit.username,
  //     password: passwordToEdit.password,
  //   });
  //   setPasswordArray(passwordArray.filter((item) => item.id !== id));
  // };

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
