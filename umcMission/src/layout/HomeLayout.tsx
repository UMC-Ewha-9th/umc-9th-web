import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav>네비게이션 바</nav>
            <main className="flex-1">
                {/* children이 렌더링 되는 것이 outlet */}
                <Outlet />
            </main>
            <footer>footer</footer>
        </div>
    );
};

export default HomeLayout;
