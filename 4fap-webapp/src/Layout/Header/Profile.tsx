import { Href, ImagePath, Logout } from "@/Constant";
import { UserProfileData } from "@/Data/Layout";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "react-feather";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect } from "react";
import { logout } from "@/Redux/Reducers/AuthSlice";

export const Profile = () => {
  const { user } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const LogOutUser = () => {
    Cookies.remove("token");
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <li className="profile-nav onhover-dropdown px-0 py-0">
      <div className="d-flex profile-media align-items-center">
        <img
          className="img-30"
          src={`${ImagePath}/dashboard/profile.png`}
          alt=""
        />
        <div className="flex-grow-1">
          <span>{user?.username}</span>
          <p className="mb-0 font-outfit">
            Free Trial<i className="fa fa-angle-down"></i>
          </p>
        </div>
      </div>
      <ul className="profile-dropdown onhover-show-div">
        {/*{UserProfileData.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              {item.icon}
              <span>{item.title} </span>
            </Link>
          </li>
        ))}*/}
        <li onClick={LogOutUser}>
          <Link href={Href} scroll={false}>
            <LogOut />
            <span>{Logout} </span>
          </Link>
        </li>
      </ul>
    </li>
  );
};
