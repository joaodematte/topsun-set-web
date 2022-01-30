import {
  FaSolarPanel,
  FaUserFriends,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSpaceDashboard, MdPrecisionManufacturing } from "react-icons/md";
import {
  BsFillDiagram2Fill,
  BsFillDiagram3Fill,
  BsFillLightningFill,
} from "react-icons/bs";

export type SidebarLinksType = {
  title: string;
  path: string | null;
  icon: JSX.Element;
  isDisabled: boolean;
  isLogout: boolean;
};

export type SidebarLinksCategoryType = {
  title: string;
  links: SidebarLinksType[];
};

export const sidebarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdSpaceDashboard size={20} />,
        isDisabled: false,
        isLogout: false,
      },
    ],
  },
  {
    title: "Geradores",
    links: [
      {
        title: "DU simplificado",
        path: "/geradores/dusimplificado",
        icon: <BsFillDiagram2Fill size={20} />,
        isDisabled: false,
        isLogout: false,
      },
      {
        title: "Diagrama unifilar",
        path: "/geradores/diagramaunifilar",
        icon: <BsFillDiagram3Fill size={20} />,
        isDisabled: true,
        isLogout: false,
      },
    ],
  },
  {
    title: "Listagens",
    links: [
      {
        title: "Inversores",
        path: "/listagens/inversores",
        icon: <BsFillLightningFill size={20} />,
        isDisabled: false,
        isLogout: false,
      },
      {
        title: "Módulos",
        path: "/listagens/modulos",
        icon: <FaSolarPanel size={20} />,
        isDisabled: false,
        isLogout: false,
      },
      {
        title: "Fabricantes",
        path: "/listagens/fabricantes",
        icon: <MdPrecisionManufacturing size={20} />,
        isDisabled: false,
        isLogout: false,
      },
      {
        title: "Usuários",
        path: "/listagens/usuarios",
        icon: <FaUserFriends size={20} />,
        isDisabled: false,
        isLogout: false,
      },
    ],
  },
  {
    title: "Meu usuário",
    links: [
      {
        title: "Configurações",
        path: "/me/configuracoes",
        icon: <FaCog size={20} />,
        isDisabled: false,
        isLogout: false,
      },
      {
        title: "Deslogar",
        path: null,
        icon: <FaSignOutAlt size={20} />,
        isDisabled: false,
        isLogout: true,
      },
    ],
  },
];
