package com.rork.cownit.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Groups
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Security
import androidx.compose.material.icons.outlined.WorkOutline
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.Role
import com.rork.cownit.data.demoUsers
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.components.SegmentButton
import com.rork.cownit.ui.components.fieldColors
import com.rork.cownit.ui.theme.CownColors

@Composable
fun AuthScreen(onLogin: (Role, String) -> Unit) {
    var selectedRole by remember { mutableStateOf(Role.INDIVIDUAL) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var twoFaEnabled by remember { mutableStateOf(true) }
    var rememberMe by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }

    val canSubmit = email.isNotEmpty() && password.isNotEmpty()

    fun submit() {
        error = ""
        if (email.isEmpty()) { error = "Enter email address"; return }
        if (password.isEmpty()) { error = "Enter password"; return }
        if (password != "password") { error = "Invalid password"; return }
        val user = demoUsers[selectedRole]?.firstOrNull()
        if (user == null) { error = "No demo user for this role"; return }
        onLogin(selectedRole, user.id)
    }

    Box(modifier = Modifier.fillMaxSize().background(CownColors.White)) {
        LoginBackgroundCurves()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            LoginLogo()
            Spacer(Modifier.height(28.dp))

            CownCard(modifier = Modifier.fillMaxWidth(), padding = androidx.compose.foundation.layout.PaddingValues(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Text(
                        "Login as",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = CownColors.Ink,
                        textAlign = TextAlign.Center,
                    )
                    Spacer(Modifier.height(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                        Role.entries.forEach { role ->
                            RoleCard(
                                role = role,
                                selected = selectedRole == role,
                                modifier = Modifier.weight(1f),
                                onClick = { selectedRole = role; error = "" },
                            )
                        }
                    }

                    Spacer(Modifier.height(20.dp))
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it; error = "" },
                        placeholder = { Text("Email address", fontSize = 14.sp, color = CownColors.Faint) },
                        leadingIcon = { Icon(Icons.Outlined.Email, contentDescription = null, tint = CownColors.Muted) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = fieldColors(),
                    )

                    Spacer(Modifier.height(14.dp))
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it; error = "" },
                        placeholder = { Text("Password", fontSize = 14.sp, color = CownColors.Faint) },
                        leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = CownColors.Muted) },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                    contentDescription = null,
                                    tint = CownColors.Muted,
                                )
                            }
                        },
                        singleLine = true,
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = fieldColors(),
                    )

                    Spacer(Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth().border(0.5.dp, CownColors.Border, RoundedCornerShape(8.dp)).padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(Icons.Outlined.Security, contentDescription = null, tint = CownColors.Muted, modifier = Modifier.size(22.dp))
                        Spacer(Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Two-factor authentication (2FA)", fontSize = 13.sp, color = CownColors.Ink, fontWeight = FontWeight.Medium)
                            Text("Secure your account with 2FA", fontSize = 12.sp, color = CownColors.Faint)
                        }
                        Switch(
                            checked = twoFaEnabled,
                            onCheckedChange = { twoFaEnabled = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = CownColors.White,
                                checkedTrackColor = CownColors.Positive,
                                uncheckedThumbColor = CownColors.White,
                                uncheckedTrackColor = CownColors.Border,
                            ),
                        )
                    }

                    Spacer(Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = rememberMe,
                                onCheckedChange = { rememberMe = it },
                                colors = CheckboxDefaults.colors(checkedColor = CownColors.Positive, uncheckedColor = CownColors.Border),
                            )
                            Text("Remember me", fontSize = 13.sp, color = CownColors.Ink)
                        }
                        TextButton(onClick = { }) {
                            Text("Forgot password?", fontSize = 13.sp, color = CownColors.Positive, fontWeight = FontWeight.Medium)
                        }
                    }

                    if (error.isNotEmpty()) {
                        Spacer(Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(CownColors.NegativeBg, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                        ) {
                            Text(error, color = CownColors.Negative, fontSize = 12.sp)
                        }
                    }

                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = { submit() },
                        enabled = canSubmit,
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CownColors.LoginNavy,
                            contentColor = CownColors.White,
                            disabledContainerColor = CownColors.Border,
                            disabledContentColor = CownColors.White,
                        ),
                    ) {
                        Text("Login", fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }

            Spacer(Modifier.height(18.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("New to CownIt?", fontSize = 13.sp, color = CownColors.Ink)
                Spacer(Modifier.width(4.dp))
                TextButton(onClick = { }) {
                    Text("Sign up", fontSize = 13.sp, color = CownColors.Positive, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

@Composable
private fun RoleCard(role: Role, selected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val (icon, label) = when (role) {
        Role.INDIVIDUAL -> Icons.Outlined.Person to "Individual"
        Role.HR -> Icons.Outlined.Groups to "HR"
        Role.CEO -> Icons.Outlined.WorkOutline to "CEO"
    }
    Column(
        modifier = modifier
            .background(if (selected) CownColors.PositiveBg else CownColors.White, RoundedCornerShape(8.dp))
            .border(0.5.dp, if (selected) CownColors.Positive else CownColors.Border, RoundedCornerShape(8.dp))
            .clickableNoRipple(onClick)
            .padding(vertical = 14.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box(
            modifier = Modifier.size(40.dp),
            contentAlignment = Alignment.Center,
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(CownColors.SurfaceMuted, CircleShape)
                    .clip(CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(icon, contentDescription = null, tint = CownColors.LoginNavy, modifier = Modifier.size(22.dp))
            }
            if (selected) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .size(16.dp)
                        .background(CownColors.Positive, CircleShape)
                        .border(1.5.dp, CownColors.White, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Filled.Check, contentDescription = null, tint = CownColors.White, modifier = Modifier.size(10.dp))
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(
            label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
            color = if (selected) CownColors.Positive else CownColors.Ink,
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun LoginLogo() {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(modifier = Modifier.size(80.dp), contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val navy = CownColors.LoginNavy
                val green = CownColors.Positive
                // Head
                drawCircle(color = navy, radius = 12f, center = Offset(size.width / 2, size.height * 0.28f))
                // Body arc
                val bodyPath = Path().apply {
                    moveTo(size.width * 0.35f, size.height * 0.52f)
                    quadraticBezierTo(size.width * 0.35f, size.height * 0.75f, size.width * 0.55f, size.height * 0.82f)
                    lineTo(size.width * 0.65f, size.height * 0.70f)
                }
                drawPath(bodyPath, color = navy, style = Stroke(width = 7f, cap = StrokeCap.Round))
                // Upward arrow
                val arrowPath = Path().apply {
                    moveTo(size.width * 0.58f, size.height * 0.45f)
                    lineTo(size.width * 0.75f, size.height * 0.28f)
                    lineTo(size.width * 0.66f, size.height * 0.28f)
                    moveTo(size.width * 0.75f, size.height * 0.28f)
                    lineTo(size.width * 0.75f, size.height * 0.37f)
                }
                drawPath(arrowPath, color = green, style = Stroke(width = 7f, cap = StrokeCap.Round))
            }
        }
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Cown", fontSize = 34.sp, fontWeight = FontWeight.Medium, color = CownColors.LoginNavy)
            Text("It", fontSize = 34.sp, fontWeight = FontWeight.Medium, color = CownColors.Positive)
        }
        Spacer(Modifier.height(2.dp))
        Text("Commit & Own It", fontSize = 14.sp, color = CownColors.Muted)
    }
}

@Composable
private fun LoginBackgroundCurves() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        // Top-right light grey decorative arc
        val topArc = Path().apply {
            moveTo(size.width, 0f)
            lineTo(size.width, size.height * 0.25f)
            quadraticBezierTo(size.width * 0.72f, size.height * 0.08f, size.width * 0.55f, 0f)
            close()
        }
        drawPath(topArc, color = CownColors.SurfaceMuted)

        // Bottom-left navy wave
        val navyWave = Path().apply {
            moveTo(0f, size.height)
            lineTo(0f, size.height * 0.78f)
            cubicTo(
                size.width * 0.35f, size.height * 0.68f,
                size.width * 0.55f, size.height * 0.88f,
                size.width, size.height * 0.82f
            )
            lineTo(size.width, size.height)
            close()
        }
        drawPath(navyWave, color = CownColors.LoginNavy)

        // Bottom-right green accent wave
        val greenWave = Path().apply {
            moveTo(size.width, size.height)
            lineTo(size.width, size.height * 0.88f)
            cubicTo(
                size.width * 0.72f, size.height * 0.94f,
                size.width * 0.45f, size.height * 0.90f,
                size.width * 0.18f, size.height
            )
            close()
        }
        drawPath(greenWave, color = CownColors.Positive)
    }
}

private fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier = this.then(
    Modifier.clickable(
        interactionSource = MutableInteractionSource(),
        indication = null,
        onClick = onClick,
    )
)