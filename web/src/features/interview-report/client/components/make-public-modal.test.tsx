// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OPEN_DATA_ENABLED } from "@/config/local-site";
import { MakePublicModal } from "./make-public-modal";

describe("MakePublicModal", () => {
  it("オープンデータ提供の告知を表示し、確定で onConfirm を呼ぶ", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <MakePublicModal
        open
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        isSubmitting={false}
      />
    );

    // オープンデータを提供しているときだけ、その告知を出す
    const notice = screen.queryByText(
      /第三者にオープンデータとして提供されることがあります/
    );
    if (OPEN_DATA_ENABLED) {
      expect(notice).toBeInTheDocument();
    } else {
      expect(notice).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: /公開にする/ }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
