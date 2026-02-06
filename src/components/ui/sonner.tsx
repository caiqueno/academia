import * as React from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
      {...props}
    />
  )
}

export { Toaster }
