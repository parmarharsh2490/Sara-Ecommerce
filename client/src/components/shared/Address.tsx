import React, { useContext, useState } from "react";
import PopupForm from "./PopupForm";
import { useCreateUserAddress, useGetUserAddress, useUpdateUserAddress } from "../../query/address.queries";
import { UserContext } from "../../context";
import AddressSkeleton from "@/utils/skeleton/AddressSkeleton";
import Meta from "@/utils/Meta";

interface AddressFieldProps {
  label: string;
  value: string;
}

const AddressField: React.FC<AddressFieldProps> = ({ label, value }) => (
  <div className="relative w-full sm:w-1/2 text-start">
    <p className="text-base sm:text-xs text-slate-400 font-semibold">
      {label}
    </p>
    <p className="text-xl">{value}</p>
  </div>
);

enum IAddressAction{
  "create",
  "update"
}
const Address: React.FC = () => {
  const [showPopupForm, setShowPopupForm] = useState(false);
  const {data : address,isLoading} = useGetUserAddress();
  const {user}  =useContext(UserContext);
  const [action,setAction] = useState<IAddressAction>(IAddressAction.create);
  const {mutateAsync : createUserAddress,isPending : isCreatingUserAddress}  = useCreateUserAddress();
  const {mutateAsync : updateUserAddress,isPending : isUpdatingUserAddress}  = useUpdateUserAddress();
  const handleAddressSubmitFunction = async(data : any) => {
    if(action === IAddressAction.create){
      createUserAddress(data)
    }else{ 
      updateUserAddress(data)
    }
  }
  if(isLoading){
    return (
      <>
            <Meta
        title="Address - Sara-Ecommerce"
        description="Manage your address information on Sara-Ecommerce. Update your street address, landmark, postal code, city, state, country, and contact number for a seamless shopping experience."
        keywords="Address, Sara-Ecommerce, Address Management, Update Address, User Profile"
        />
    <AddressSkeleton/>
      </>
  )
  }
  return (
    <>
      <Meta
        title="Address - Sara-Ecommerce"
        description="Manage your address information on Sara-Ecommerce. Update your street address, landmark, postal code, city, state, country, and contact number for a seamless shopping experience."
        keywords="Address, Sara-Ecommerce, Address Management, Update Address, User Profile"
        />
      <div className="sm:py-14 sm:px-14 py-10 px-5 h-auto w-full">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-semibold text-2xl">Address</h1>
        <div
        className="flex text-red-500 justify-center items-center text-xl cursor-pointer" 
        >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          className="mr-2"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path>
        </svg>
         {address ? <p 
         onClick={() => {
        setAction(IAddressAction.update)
        setShowPopupForm(!showPopupForm)
         }
         }>Update address</p> : <p
         onClick={() => {
         setAction(IAddressAction.create)
         setShowPopupForm(!showPopupForm)
         }
         }
         >Add new address</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full justify-between items-center">
        <AddressField label="Your Street Address" value={address?.address ||"ogejmwosgf"} />
        <AddressField label="Your Landmark" value={address?.landMark ||"ogejmwosgf"} />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full justify-between items-center">
        <AddressField label="Your Postal Code" value={address?.postalCode ||"ogejmwosgf"}/>
        <AddressField label="Your City" value={address?.city ||"ogejmwosgf"} />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full justify-between items-center">
        <AddressField label="Your State" value={address?.state ||"ogejmwosgf"} />
        <AddressField label="Your Country" value={address?.country ||"ogejmwosgf"} />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full justify-between items-center">
        <AddressField label="Your Contact Number" value={user?.mobileNumber ||"ogejmwosgf"}/>
      </div>
      </div>

      <PopupForm
      handleSubmitFunction={(data : any) =>handleAddressSubmitFunction(data)}
      inputData={[
        { type: "string", label: "address", name: "Street Address" },
        { type: "string", label: "landMark", name: "Landmark" },
        { type: "number", label: "postalCode", name: "Postal Code" },
        { type: "string", label: "city", name: "City" },
        { type: "string", label: "state", name: "State" },
        { type: "string", label: "country", name: "Country" },
        { type: "number", label: "contactNumber", name: "Contact Number" },
      ]}
      isLoading={action === IAddressAction.create ? isCreatingUserAddress : isUpdatingUserAddress}
      showPopupForm={showPopupForm}
      setShowPopupForm={setShowPopupForm} 
      label={"Add Your Address"}
      />
    </>
  );
};

export default Address;
