import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import MobileSidbear from "components/MobileSidbear";
import NavItems from "components/NavItems";

import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidbear />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
